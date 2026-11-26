import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import {
  fetchCatalogProducts,
  createCatalogProduct,
  deleteCatalogProduct,
} from '../lib/supabase';

const FALLBACK_PRODUCTS = [
  {
    id: 'fb-1',
    nombre: 'Smart TV 55 Pulgadas 4K Ultra HD',
    descripcion: 'Televisor inteligente con panel LED, HDR10 y sistema operativo integrado para streaming.',
    precio: 1699000,
    imagen_url: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800',
  },
  {
    id: 'fb-2',
    nombre: 'Portátil Ultrabook Pro 14 Pulgadas',
    descripcion: 'Procesador de alto rendimiento, 16GB RAM, SSD 512GB y chasis ultraligero en aluminio.',
    precio: 2850000,
    imagen_url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800',
  },
  {
    id: 'fb-3',
    nombre: 'Cafetera Espresso Automática',
    descripcion: 'Sistema de presión de 15 bares con espumador de leche profesional para el hogar.',
    precio: 649000,
    imagen_url: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800',
  },
];

export default function CatalogScreen({
  currentUser,
  cartItems = [],
  onAddToCart,
  onDecrementFromCart,
  onRemoveFromCart,
  onOpenCart,
}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estado para formulario de Administrador (Agregar nuevo artículo)
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [imagenUrl, setImagenUrl] = useState('');
  const [savingProduct, setSavingProduct] = useState(false);
  const [adminFeedback, setAdminFeedback] = useState({ type: '', message: '' });

  const isAdmin =
    currentUser &&
    (String(currentUser.rol || '').toLowerCase() === 'administrador' ||
      String(currentUser.rol || '').toLowerCase() === 'asesor');

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await fetchCatalogProducts();
      if (!error && data && data.length > 0) {
        setProducts(data);
      } else {
        setProducts(FALLBACK_PRODUCTS);
      }
    } catch {
      setProducts(FALLBACK_PRODUCTS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleCreateProduct = async () => {
    setAdminFeedback({ type: '', message: '' });

    if (!nombre.trim() || !descripcion.trim() || !precio.trim()) {
      setAdminFeedback({
        type: 'error',
        message: 'Completa el nombre, descripción y precio del artículo.',
      });
      return;
    }

    const numericPrice = Number(precio.replace(/[^0-9]/g, ''));
    if (!numericPrice || numericPrice <= 0) {
      setAdminFeedback({
        type: 'error',
        message: 'Ingresa un precio válido mayor a 0.',
      });
      return;
    }

    setSavingProduct(true);
    const { error } = await createCatalogProduct({
      nombre,
      descripcion,
      precio: numericPrice,
      imagen_url: imagenUrl,
    });
    setSavingProduct(false);

    if (error) {
      setAdminFeedback({
        type: 'error',
        message: 'No se pudo guardar el artículo en Supabase.',
      });
      return;
    }

    setAdminFeedback({
      type: 'success',
      message: '¡Artículo agregado exitosamente al catálogo!',
    });
    setNombre('');
    setDescripcion('');
    setPrecio('');
    setImagenUrl('');
    loadProducts();
  };

  const handleDeleteProduct = async (id) => {
    await deleteCatalogProduct(id);
    loadProducts();
  };

  const getCartQuantity = (productId) => {
    const found = cartItems.find((item) => item.id === productId);
    return found ? found.quantity : 0;
  };

  const totalUnitsInCart = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalCartAmount = cartItems.reduce(
    (acc, item) => acc + Number(item.precio) * item.quantity,
    0
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4f46e5" />
        <Text style={styles.helperText}>Cargando catálogo de productos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.heroBanner}>
        <View style={styles.heroTopRow}>
          <View style={styles.heroTextCol}>
            <Text style={styles.heroBadge}>CATÁLOGO OFICIAL • {products.length} ARTÍCULOS</Text>
            <Text style={styles.heading}>Nuestros Productos</Text>
          </View>
          {isAdmin ? (
            <TouchableOpacity
              style={[styles.adminToggleBtn, showAdminForm && styles.adminToggleBtnActive]}
              onPress={() => setShowAdminForm((prev) => !prev)}
            >
              <Text style={styles.adminToggleText}>
                {showAdminForm ? '✕ Cerrar' : '＋ Nuevo Artículo'}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
        <Text style={styles.subheading}>
          Selecciona los artículos que desees agregar a tu carrito de compras.
        </Text>
      </View>

      {totalUnitsInCart > 0 ? (
        <TouchableOpacity style={styles.cartFloatingBar} onPress={onOpenCart}>
          <View>
            <Text style={styles.cartBarTitle}>
              🛒 {totalUnitsInCart} artículo(s) en tu carrito
            </Text>
            <Text style={styles.cartBarSubtitle}>
              Total acumulado: ${totalCartAmount.toLocaleString('es-CO')}
            </Text>
          </View>
          <View style={styles.cartBarAction}>
            <Text style={styles.cartBarActionText}>Ver Carrito →</Text>
          </View>
        </TouchableOpacity>
      ) : null}

      {isAdmin && showAdminForm ? (
        <View style={styles.adminCard}>
          <Text style={styles.adminBadge}>PANEL DE ADMINISTRACIÓN DE CATÁLOGO</Text>
          <Text style={styles.adminHeading}>Agregar Nuevo Artículo</Text>

          <Text style={styles.label}>Nombre del artículo</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej. Cafetera Digital Programable"
            placeholderTextColor="#94a3b8"
            value={nombre}
            onChangeText={setNombre}
          />

          <Text style={styles.label}>Descripción breve</Text>
          <TextInput
            style={styles.input}
            placeholder="Características principales del producto"
            placeholderTextColor="#94a3b8"
            value={descripcion}
            onChangeText={setDescripcion}
          />

          <Text style={styles.label}>Precio (COP)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej. 350000"
            placeholderTextColor="#94a3b8"
            keyboardType="numeric"
            value={precio}
            onChangeText={setPrecio}
          />

          <Text style={styles.label}>URL de Imagen (opcional)</Text>
          <TextInput
            style={styles.input}
            placeholder="https://images.unsplash.com/..."
            placeholderTextColor="#94a3b8"
            autoCapitalize="none"
            value={imagenUrl}
            onChangeText={setImagenUrl}
          />

          {adminFeedback.message ? (
            <Text
              style={
                adminFeedback.type === 'error' ? styles.errorText : styles.successText
              }
            >
              {adminFeedback.message}
            </Text>
          ) : null}

          <TouchableOpacity
            style={styles.saveProductBtn}
            onPress={handleCreateProduct}
            disabled={savingProduct}
          >
            {savingProduct ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.saveProductText}>Publicar Artículo en el Catálogo</Text>
            )}
          </TouchableOpacity>
        </View>
      ) : null}

      {products.map((item) => {
        const qtyInCart = getCartQuantity(item.id);

        return (
          <View key={item.id} style={styles.card}>
            <View style={styles.imageWrap}>
              <Image source={{ uri: item.imagen_url }} style={styles.image} resizeMode="cover" />
              <View style={styles.tagPrice}>
                <Text style={styles.tagPriceText}>
                  ${Number(item.precio).toLocaleString('es-CO')}
                </Text>
              </View>
              {qtyInCart > 0 ? (
                <View style={styles.inCartRibbon}>
                  <Text style={styles.inCartRibbonText}>
                    En carrito: {qtyInCart}
                  </Text>
                </View>
              ) : null}
            </View>

            <View style={styles.cardBody}>
              <View style={styles.stockRow}>
                <View style={styles.stockBadge}>
                  <Text style={styles.stockText}>✓ Disponible</Text>
                </View>
                {isAdmin ? (
                  <TouchableOpacity
                    style={styles.deleteProdBtn}
                    onPress={() => handleDeleteProduct(item.id)}
                  >
                    <Text style={styles.deleteProdText}>🗑️ Eliminar del catálogo</Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.categoryText}>Andina Tech & Hogar</Text>
                )}
              </View>

              <Text style={styles.title}>{item.nombre}</Text>
              <Text style={styles.description}>{item.descripcion}</Text>

              {qtyInCart === 0 ? (
                <TouchableOpacity
                  style={styles.addCartBtn}
                  onPress={() => onAddToCart(item)}
                >
                  <Text style={styles.addCartBtnText}>🛒 Agregar al Carrito</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.cartControlsRow}>
                  <View style={styles.qtyStepper}>
                    <TouchableOpacity
                      style={styles.stepBtn}
                      onPress={() => onDecrementFromCart(item.id)}
                    >
                      <Text style={styles.stepBtnText}>−</Text>
                    </TouchableOpacity>
                    <Text style={styles.qtyCountText}>{qtyInCart}</Text>
                    <TouchableOpacity
                      style={styles.stepBtn}
                      onPress={() => onAddToCart(item)}
                    >
                      <Text style={styles.stepBtnText}>+</Text>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    style={styles.removeCartBtn}
                    onPress={() => onRemoveFromCart(item.id)}
                  >
                    <Text style={styles.removeCartBtnText}>✕ Quitar del carrito</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 14,
    paddingBottom: 14,
  },
  center: {
    paddingVertical: 50,
    alignItems: 'center',
    gap: 10,
  },
  heroBanner: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e0e7ff',
    gap: 6,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  heroTextCol: {
    flex: 1,
  },
  heroBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: '#4f46e5',
    letterSpacing: 1,
  },
  heading: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1e1b4b',
  },
  subheading: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
  },
  adminToggleBtn: {
    backgroundColor: '#4f46e5',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
  },
  adminToggleBtnActive: {
    backgroundColor: '#334155',
  },
  adminToggleText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  cartFloatingBar: {
    backgroundColor: '#1e1b4b',
    padding: 14,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#818cf8',
  },
  cartBarTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  cartBarSubtitle: {
    color: '#a5b4fc',
    fontSize: 12,
    marginTop: 2,
    fontWeight: '600',
  },
  cartBarAction: {
    backgroundColor: '#4f46e5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  cartBarActionText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  adminCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#818cf8',
    gap: 6,
  },
  adminBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: '#4f46e5',
    letterSpacing: 0.8,
  },
  adminHeading: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e1b4b',
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1e293b',
    marginTop: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    color: '#0f172a',
    backgroundColor: '#f8fafc',
  },
  saveProductBtn: {
    backgroundColor: '#10b981',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  saveProductText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 14,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
  successText: {
    color: '#15803d',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
  helperText: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  imageWrap: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 185,
    backgroundColor: '#e2e8f0',
  },
  tagPrice: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#1e1b4b',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#818cf8',
  },
  tagPriceText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 15,
  },
  inCartRibbon: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#10b981',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  inCartRibbonText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
  },
  cardBody: {
    padding: 16,
    gap: 8,
  },
  stockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stockBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  stockText: {
    color: '#15803d',
    fontSize: 11,
    fontWeight: '700',
  },
  categoryText: {
    fontSize: 11,
    color: '#6366f1',
    fontWeight: '700',
  },
  deleteProdBtn: {
    backgroundColor: '#fef2f2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  deleteProdText: {
    color: '#dc2626',
    fontSize: 11,
    fontWeight: '700',
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0f172a',
  },
  description: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 19,
  },
  addCartBtn: {
    backgroundColor: '#4f46e5',
    paddingVertical: 11,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 4,
  },
  addCartBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  cartControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
    gap: 10,
  },
  qtyStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eef2ff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#818cf8',
  },
  stepBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  stepBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#312e81',
  },
  qtyCountText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1e1b4b',
    paddingHorizontal: 10,
  },
  removeCartBtn: {
    flex: 1,
    backgroundColor: '#fee2e2',
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  removeCartBtnText: {
    color: '#b91c1c',
    fontSize: 12,
    fontWeight: '800',
  },
});
