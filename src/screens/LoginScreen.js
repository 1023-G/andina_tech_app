import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { loginUserAccount } from '../lib/supabase';

export default function LoginScreen({ onLoginSuccess, onGoToRegister }) {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async () => {
    setErrorMsg('');

    if (!correo.trim() || !password.trim()) {
      setErrorMsg('Ingresa tu correo electrónico y contraseña.');
      return;
    }

    setLoading(true);
    const { data, error } = await loginUserAccount(correo, password);
    setLoading(false);

    if (error || !data) {
      setErrorMsg('Credenciales inválidas. Verifica tu correo y contraseña o regístrate primero.');
      return;
    }

    onLoginSuccess(data);
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerBlock}>
        <Text style={styles.badge}>ACCESO PRIVADO</Text>
        <Text style={styles.heading}>Iniciar Sesión</Text>
        <Text style={styles.subheading}>
          Ingresa tus credenciales para consultar el panel de miembros registrados.
        </Text>
      </View>

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

      <Text style={styles.label}>Contraseña</Text>
      <TextInput
        style={styles.input}
        placeholder="Tu contraseña"
        placeholderTextColor="#94a3b8"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {errorMsg ? (
        <View style={styles.alertError}>
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      ) : null}

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.buttonText}>Ingresar al Panel</Text>
        )}
      </TouchableOpacity>

      {onGoToRegister ? (
        <TouchableOpacity style={styles.switchLink} onPress={onGoToRegister}>
          <Text style={styles.switchText}>
            ¿Aún no tienes cuenta? <Text style={styles.switchTextBold}>Regístrate aquí</Text>
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
  alertError: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    padding: 10,
    borderRadius: 10,
    marginTop: 4,
  },
  button: {
    backgroundColor: '#1e1b4b',
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
