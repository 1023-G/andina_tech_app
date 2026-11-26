import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { supabase, fetchRegisteredUsers, deleteRegisteredUser } from '../lib/supabase';

export default function UsersPanelScreen({ currentUser, onGoToCatalogAdmin }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const isAdmin =
    currentUser &&
    (String(currentUser.rol || '').toLowerCase() === 'administrador' ||
      String(currentUser.rol || '').toLowerCase() === 'asesor');

  const loadUsers = useCallback(async () => {
    const { data, error } = await fetchRegisteredUsers();
    if (!error && data) {
      setUsers(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadUsers();

    const channel = supabase
      .channel('usuarios-realtime-sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'usuarios_app' },
        () => loadUsers()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'productos' },
        () => loadUsers()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadUsers]);

  const handleDeleteUser = async (userId) => {
    await deleteRegisteredUser(userId);
    loadUsers();
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4f46e5" />
        <Text style={styles.helperText}>Consultando usuarios registrados...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerBanner}>
        <View style={styles.headerTopRow}>
          <View>
            <Text style={styles.privateBadge}>ZONA PRIVADA • TIEMPO REAL</Text>
            <Text style={styles.heading}>Usuarios Registrados</Text>
          </View>
          <TouchableOpacity style={styles.refreshBtn} onPress={loadUsers}>
            <Text style={styles.refreshText}>↻ Actualizar</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.subheading}>
          Hola, <Text style={styles.boldName}>{currentUser.nombre_completo}</Text> ({currentUser.rol}).
          Actualmente hay {users.length} miembro(s) registrado(s) en la plataforma.
        </Text>

        {isAdmin && onGoToCatalogAdmin ? (
          <TouchableOpacity style={styles.adminActionBtn} onPress={onGoToCatalogAdmin}>
            <Text style={styles.adminActionText}>
              ➕ Ir al Catálogo para Agregar o Eliminar Artículos
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {users.map((u) => {
        const initials = (u.nombre_completo || 'U')
          .split(' ')
          .slice(0, 2)
          .map((w) => w[0])
          .join('')
          .toUpperCase();

        return (
          <View key={u.id} style={styles.userCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <View style={styles.userInfo}>
              <View style={styles.rowTop}>
                <Text style={styles.userName}>{u.nombre_completo}</Text>
                <View style={styles.badgeWrap}>
                  <Text style={styles.badge}>{u.rol}</Text>
                </View>
              </View>
              <Text style={styles.detail}>✉️ {u.correo}</Text>
              <View style={styles.bottomRow}>
                <Text style={styles.detail}>📞 {u.telefono}</Text>
                {isAdmin ? (
                  <TouchableOpacity
                    style={styles.deleteUserBtn}
                    onPress={() => handleDeleteUser(u.id)}
                  >
                    <Text style={styles.deleteUserText}>🗑️ Eliminar</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    paddingBottom: 12,
  },
  center: {
    paddingVertical: 50,
    alignItems: 'center',
    gap: 10,
  },
  headerBanner: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e0e7ff',
    gap: 8,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  privateBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: '#4f46e5',
    letterSpacing: 1,
    marginBottom: 2,
  },
  heading: {
    fontSize: 21,
    fontWeight: '800',
    color: '#1e1b4b',
  },
  refreshBtn: {
    backgroundColor: '#eef2ff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#c7d2fe',
  },
  refreshText: {
    color: '#4338ca',
    fontSize: 12,
    fontWeight: '700',
  },
  subheading: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
  },
  boldName: {
    color: '#1e1b4b',
    fontWeight: '700',
  },
  adminActionBtn: {
    backgroundColor: '#4f46e5',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 2,
  },
  adminActionText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  helperText: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '600',
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#4f46e5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 15,
  },
  userInfo: {
    flex: 1,
    gap: 3,
  },
  rowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  userName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
    flex: 1,
  },
  badgeWrap: {
    backgroundColor: '#eef2ff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#c7d2fe',
  },
  badge: {
    color: '#4338ca',
    fontSize: 11,
    fontWeight: '800',
  },
  detail: {
    fontSize: 13,
    color: '#475569',
  },
  deleteUserBtn: {
    backgroundColor: '#fef2f2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  deleteUserText: {
    color: '#dc2626',
    fontSize: 11,
    fontWeight: '700',
  },
});
