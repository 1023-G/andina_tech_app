import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function NavBar({
  currentRoute,
  isAuthenticated,
  cartCount = 0,
  onNavigate,
  onLogout,
}) {
  return (
    <View style={styles.navBar}>
      <TouchableOpacity
        style={[styles.navItem, currentRoute === 'catalog' && styles.activeItem]}
        onPress={() => onNavigate('catalog')}
      >
        <Text style={[styles.navText, currentRoute === 'catalog' && styles.activeText]}>
          🛍️ Catálogo
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.navItem, currentRoute === 'cart' && styles.activeItem]}
        onPress={() => onNavigate('cart')}
      >
        <Text style={[styles.navText, currentRoute === 'cart' && styles.activeText]}>
          🛒 Carrito{cartCount > 0 ? ` (${cartCount})` : ''}
        </Text>
      </TouchableOpacity>

      {!isAuthenticated ? (
        <>
          <TouchableOpacity
            style={[styles.navItem, currentRoute === 'login' && styles.activeItem]}
            onPress={() => onNavigate('login')}
          >
            <Text style={[styles.navText, currentRoute === 'login' && styles.activeText]}>
              🔐 Login
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navItem, currentRoute === 'register' && styles.activeItem]}
            onPress={() => onNavigate('register')}
          >
            <Text style={[styles.navText, currentRoute === 'register' && styles.activeText]}>
              📝 Registro
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TouchableOpacity
            style={[styles.navItem, currentRoute === 'users' && styles.activeItem]}
            onPress={() => onNavigate('users')}
          >
            <Text style={[styles.navText, currentRoute === 'users' && styles.activeText]}>
              👥 Usuarios
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
            <Text style={styles.logoutText}>🚪 Salir</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  navBar: {
    backgroundColor: '#312e81',
    paddingHorizontal: 8,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  navItem: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 9,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  activeItem: {
    backgroundColor: '#ffffff',
  },
  navText: {
    color: '#e0e7ff',
    fontSize: 12,
    fontWeight: '700',
  },
  activeText: {
    color: '#312e81',
  },
  logoutBtn: {
    backgroundColor: '#ef4444',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 9,
    alignItems: 'center',
  },
  logoutText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
});
