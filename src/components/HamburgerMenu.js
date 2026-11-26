import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function HamburgerMenu({
  visible,
  currentRoute,
  currentUser,
  cartCount = 0,
  onClose,
  onNavigate,
  onLogout,
}) {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.drawer}>
        <View style={styles.drawerHeader}>
          <View>
            <Text style={styles.drawerBadge}>NAVEGACIÓN RÁPIDA</Text>
            <Text style={styles.drawerTitle}>Menú Principal</Text>
          </View>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.sessionBox, currentUser ? styles.sessionBoxActive : null]}>
          <View style={[styles.statusDot, currentUser ? styles.dotOnline : styles.dotGuest]} />
          <View style={styles.sessionTextWrap}>
            <Text style={styles.sessionTitle}>
              {currentUser ? currentUser.nombre_completo : 'Modo Visitante'}
            </Text>
            <Text style={styles.sessionSub}>
              {currentUser ? `${currentUser.rol} • Sesión activa` : 'Sin sesión iniciada'}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>SECCIONES</Text>

        <TouchableOpacity
          style={[styles.option, currentRoute === 'catalog' && styles.optionActive]}
          onPress={() => onNavigate('catalog')}
        >
          <Text style={styles.optionIcon}>🛍️</Text>
          <View style={styles.optionContent}>
            <Text style={[styles.optionText, currentRoute === 'catalog' && styles.optionTextActive]}>
              Catálogo Público (Index)
            </Text>
            <Text style={styles.optionHint}>Ver y seleccionar artículos</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.option, currentRoute === 'cart' && styles.optionActive]}
          onPress={() => onNavigate('cart')}
        >
          <Text style={styles.optionIcon}>🛒</Text>
          <View style={styles.optionContent}>
            <Text style={[styles.optionText, currentRoute === 'cart' && styles.optionTextActive]}>
              Mi Carrito ({cartCount})
            </Text>
            <Text style={styles.optionHint}>Revisar o quitar productos</Text>
          </View>
        </TouchableOpacity>

        {!currentUser ? (
          <>
            <TouchableOpacity
              style={[styles.option, currentRoute === 'login' && styles.optionActive]}
              onPress={() => onNavigate('login')}
            >
              <Text style={styles.optionIcon}>🔐</Text>
              <View style={styles.optionContent}>
                <Text style={[styles.optionText, currentRoute === 'login' && styles.optionTextActive]}>
                  Iniciar Sesión
                </Text>
                <Text style={styles.optionHint}>Acceso para miembros y admin</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.option, currentRoute === 'register' && styles.optionActive]}
              onPress={() => onNavigate('register')}
            >
              <Text style={styles.optionIcon}>📝</Text>
              <View style={styles.optionContent}>
                <Text style={[styles.optionText, currentRoute === 'register' && styles.optionTextActive]}>
                  Registro de Usuarios
                </Text>
                <Text style={styles.optionHint}>Crear una nueva cuenta</Text>
              </View>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              style={[styles.option, currentRoute === 'users' && styles.optionActive]}
              onPress={() => onNavigate('users')}
            >
              <Text style={styles.optionIcon}>👥</Text>
              <View style={styles.optionContent}>
                <Text style={[styles.optionText, currentRoute === 'users' && styles.optionTextActive]}>
                  Panel de Usuarios
                </Text>
                <Text style={styles.optionHint}>Directorio privado en tiempo real</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutOption} onPress={onLogout}>
              <Text style={styles.optionIcon}>🚪</Text>
              <View style={styles.optionContent}>
                <Text style={styles.logoutOptionText}>Cerrar Sesión</Text>
                <Text style={styles.logoutHint}>Volver al modo público</Text>
              </View>
            </TouchableOpacity>
          </>
        )}
      </View>

      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
    elevation: 20,
    flexDirection: 'row',
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
  },
  drawer: {
    width: '82%',
    maxWidth: 330,
    backgroundColor: '#ffffff',
    padding: 20,
    justifyContent: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 24,
  },
  backdrop: {
    flex: 1,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  drawerBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: '#4f46e5',
    letterSpacing: 1,
    marginBottom: 2,
  },
  drawerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1e1b4b',
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 16,
    color: '#334155',
    fontWeight: '800',
  },
  sessionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 12,
    borderRadius: 12,
    marginBottom: 18,
  },
  sessionBoxActive: {
    backgroundColor: '#eef2ff',
    borderColor: '#c7d2fe',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dotOnline: {
    backgroundColor: '#10b981',
  },
  dotGuest: {
    backgroundColor: '#94a3b8',
  },
  sessionTextWrap: {
    flex: 1,
  },
  sessionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
  },
  sessionSub: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 1,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94a3b8',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  optionActive: {
    backgroundColor: '#eef2ff',
    borderColor: '#818cf8',
  },
  optionIcon: {
    fontSize: 20,
  },
  optionContent: {
    flex: 1,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
  },
  optionTextActive: {
    color: '#4338ca',
  },
  optionHint: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 1,
  },
  logoutOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 10,
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  logoutOptionText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#dc2626',
  },
  logoutHint: {
    fontSize: 11,
    color: '#ef4444',
    marginTop: 1,
  },
});
