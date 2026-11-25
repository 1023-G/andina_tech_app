import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { registerUserAccount } from '../lib/supabase';

const ROLES = ['Cliente', 'Asesor', 'Administrador'];

export default function RegisterScreen({ onRegistered, onGoToLogin }) {
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [rol, setRol] = useState('Cliente');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const handleRegister = async () => {
    setFeedback({ type: '', message: '' });

    if (!nombreCompleto.trim() || !correo.trim() || !telefono.trim() || !password.trim()) {
      setFeedback({ type: 'error', message: 'Todos los campos son obligatorios.' });
      return;
    }

    if (!correo.includes('@')) {
      setFeedback({ type: 'error', message: 'Ingresa un correo electrónico válido.' });
      return;
    }

    if (password.length < 4) {
      setFeedback({ type: 'error', message: 'La contraseña debe tener al menos 4 caracteres.' });
      return;
    }

    setSubmitting(true);
    const { error } = await registerUserAccount({
      nombre_completo: nombreCompleto,
      correo,
      telefono,
      rol,
      password,
    });
    setSubmitting(false);

    if (error) {
      setFeedback({
        type: 'error',
        message: error.code === '23505'
          ? 'Ese correo ya está registrado.'
          : 'No se pudo completar el registro. Intenta de nuevo.',
      });
      return;
    }

    setFeedback({ type: 'success', message: '¡Cuenta creada con éxito! Redirigiendo a Iniciar Sesión...' });
    setNombreCompleto('');
    setCorreo('');
    setTelefono('');
    setRol('Cliente');
    setPassword('');
    if (onRegistered) {
      setTimeout(() => onRegistered(), 900);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerBlock}>
        <Text style={styles.badge}>NUEVO MIEMBRO</Text>
        <Text style={styles.heading}>Registro de Usuarios</Text>
        <Text style={styles.subheading}>
          Completa tus datos para crear tu cuenta y acceder al panel interno.
        </Text>
      </View>

      <Text style={styles.label}>Nombre completo</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej. Ana Laura Valencia"
        placeholderTextColor="#94a3b8"
        value={nombreCompleto}
        onChangeText={setNombreCompleto}
      />

      <Text style={styles.label}>Correo electrónico</Text>
      <TextInput
        style={styles.input}
        placeholder="correo@ejemplo.com"
        placeholderTextColor="#94a3b8"
        keyboardType="email-address"
        autoCapitalize="none"
        value={correo}
        onChangeText={setCorreo}
      />

      <Text style={styles.label}>Teléfono de contacto</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej. 3001234567"
        placeholderTextColor="#94a3b8"
        keyboardType="phone-pad"
        value={telefono}
        onChangeText={setTelefono}
      />

      <Text style={styles.label}>Rol en la plataforma</Text>
      <View style={styles.roleRow}>
        {ROLES.map((item) => {
          const active = rol === item;
          return (
            <TouchableOpacity
              key={item}
              style={[styles.roleChip, active && styles.roleChipActive]}
              onPress={() => setRol(item)}
            >
              <Text style={[styles.roleChipText, active && styles.roleChipTextActive]}>
                {item}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.label}>Contraseña</Text>
      <TextInput
        style={styles.input}
        placeholder="Mínimo 4 caracteres"
        placeholderTextColor="#94a3b8"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {feedback.message ? (
        <View style={[styles.alertBox, feedback.type === 'error' ? styles.alertError : styles.alertSuccess]}>
          <Text style={feedback.type === 'error' ? styles.errorText : styles.successText}>
            {feedback.message}
          </Text>
        </View>
      ) : null}

      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={submitting}>
        {submitting ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.buttonText}>Crear Cuenta</Text>
        )}
      </TouchableOpacity>

      {onGoToLogin ? (
        <TouchableOpacity style={styles.switchLink} onPress={onGoToLogin}>
          <Text style={styles.switchText}>
            ¿Ya tienes una cuenta? <Text style={styles.switchTextBold}>Inicia sesión aquí</Text>
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e0e7ff',
    gap: 8,
  },
  headerBlock: {
    marginBottom: 6,
    gap: 3,
  },
  badge: {
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
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e293b',
    marginTop: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    color: '#0f172a',
    backgroundColor: '#f8fafc',
  },
  roleRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  roleChip: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 10,
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  roleChipActive: {
    backgroundColor: '#eef2ff',
    borderColor: '#4f46e5',
  },
  roleChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748b',
  },
  roleChipTextActive: {
    color: '#4338ca',
  },
  alertBox: {
    padding: 10,
    borderRadius: 10,
    marginTop: 4,
  },
  alertError: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  alertSuccess: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  button: {
    backgroundColor: '#4f46e5',
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 15,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 13,
    fontWeight: '600',
  },
  successText: {
    color: '#15803d',
    fontSize: 13,
    fontWeight: '600',
  },
  switchLink: {
    marginTop: 8,
    alignItems: 'center',
    paddingVertical: 6,
  },
  switchText: {
    fontSize: 13,
    color: '#64748b',
  },
  switchTextBold: {
    color: '#4f46e5',
    fontWeight: '700',
  },
});
