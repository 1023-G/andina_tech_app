import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.EXPO_PUBLIC_SUPABASE_URL ||
  'https://pkzmkteualhqvahggkqn.supabase.co';

const supabaseAnonKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  'sb_publishable_kID1liPsZrwyknp3sWWpJQ_SMqsJHE2';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const USER_PREFIX = '__USER_ACCOUNT__::';

/**
 * Convierte una fila de respaldo en `productos` a un objeto de usuario
 */
function parseFallbackUserRow(row) {
  try {
    const raw = row.descripcion.slice(USER_PREFIX.length);
    const parsed = JSON.parse(raw);
    return {
      id: row.id,
      nombre_completo: parsed.nombre_completo || row.nombre.replace('[USUARIO] ', ''),
      correo: (parsed.correo || '').toLowerCase(),
      telefono: parsed.telefono || '',
      rol: parsed.rol || 'Cliente',
      password: parsed.password || '',
      created_at: row.created_at,
    };
  } catch {
    return null;
  }
}

/**
 * Obtiene todos los productos del catálogo (excluyendo registros internos de usuarios de respaldo)
 */
export async function fetchCatalogProducts() {
  const { data, error } = await supabase
    .from('productos')
    .select('id, nombre, descripcion, precio, imagen_url')
    .order('id', { ascending: false });

  if (error || !data) {
    return { data: null, error };
  }

  const cleanProducts = data.filter(
    (item) =>
      !String(item.descripcion || '').startsWith(USER_PREFIX) &&
      item.nombre !== 'Test'
  );

  return { data: cleanProducts, error: null };
}

/**
 * Crea un nuevo producto en la base de datos (para Administradores)
 */
export async function createCatalogProduct({ nombre, descripcion, precio, imagen_url }) {
  const payload = {
    nombre: nombre.trim(),
    descripcion: descripcion.trim(),
    precio: Number(precio) || 0,
    imagen_url:
      imagen_url && imagen_url.trim()
        ? imagen_url.trim()
        : 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800',
  };

  const { data, error } = await supabase
    .from('productos')
    .insert([payload])
    .select()
    .single();

  return { data, error };
}

/**
 * Elimina un producto del catálogo por ID (para Administradores)
 */
export async function deleteCatalogProduct(productId) {
  const { error } = await supabase
    .from('productos')
    .delete()
    .eq('id', productId);

  return { error };
}

/**
 * Registra un usuario en Supabase (`usuarios_app`, o respaldo automático en la nube si la tabla aún no existe)
 */
export async function registerUserAccount({ nombre_completo, correo, telefono, rol, password }) {
  const cleanEmail = correo.trim().toLowerCase();
  const payload = {
    nombre_completo: nombre_completo.trim(),
    correo: cleanEmail,
    telefono: telefono.trim(),
    rol: rol || 'Cliente',
    password,
  };

  // 1. Intentar en la tabla principal `usuarios_app`
  const { error } = await supabase.from('usuarios_app').insert([payload]);

  if (!error) {
    return { error: null };
  }

  if (error.code === '23505') {
    return { error: { code: '23505', message: 'Ese correo ya está registrado.' } };
  }

  // 2. Respaldo persistente en la nube
  const existingUsers = await fetchFallbackUsers();
  if (existingUsers.some((u) => u.correo === cleanEmail)) {
    return { error: { code: '23505', message: 'Ese correo ya está registrado.' } };
  }

  const fallbackRow = {
    nombre: `[USUARIO] ${payload.nombre_completo}`,
    descripcion: `${USER_PREFIX}${JSON.stringify(payload)}`,
    precio: 0,
    imagen_url:
      'https://ui-avatars.com/api/?background=4f46e5&color=fff&name=' +
      encodeURIComponent(payload.nombre_completo),
  };

  const { error: fbError } = await supabase.from('productos').insert([fallbackRow]);
  if (fbError) {
    return { error: fbError };
  }

  return { error: null };
}

async function fetchFallbackUsers() {
  const { data, error } = await supabase
    .from('productos')
    .select('id, nombre, descripcion, created_at')
    .like('descripcion', `${USER_PREFIX}%`)
    .order('id', { ascending: false });

  if (error || !data) return [];
  return data.map(parseFallbackUserRow).filter(Boolean);
}

/**
 * Valida credenciales de inicio de sesión contra Supabase
 */
export async function loginUserAccount(correo, password) {
  const cleanEmail = correo.trim().toLowerCase();

  const { data, error } = await supabase
    .from('usuarios_app')
    .select('id, nombre_completo, correo, telefono, rol')
    .eq('correo', cleanEmail)
    .eq('password', password)
    .maybeSingle();

  if (!error && data) {
    return { data, error: null };
  }

  const fbUsers = await fetchFallbackUsers();
  const matched = fbUsers.find(
    (u) => u.correo === cleanEmail && u.password === password
  );

  if (matched) {
    const { password: _pw, ...safeUser } = matched;
    return { data: safeUser, error: null };
  }

  return { data: null, error: { message: 'Credenciales inválidas' } };
}

/**
 * Obtiene la lista de todos los usuarios registrados (sin contraseñas)
 */
export async function fetchRegisteredUsers() {
  const { data, error } = await supabase
    .from('usuarios_app')
    .select('id, nombre_completo, correo, telefono, rol, created_at')
    .order('id', { ascending: false });

  if (!error && data) {
    return { data, error: null };
  }

  const fbUsers = await fetchFallbackUsers();
  const safeList = fbUsers.map(({ password: _pw, ...rest }) => rest);
  return { data: safeList, error: null };
}
