import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function Header({ brandName, menuOpen, onToggleMenu }) {
  return (
    <View style={styles.header}>
      <View style={styles.brandRow}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoText}>AT</Text>
        </View>
        <View style={styles.brandTextWrap}>
          <Text style={styles.brand} numberOfLines={1}>
            {brandName}
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            Tecnología & Hogar • Portal Oficial
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.menuButton, menuOpen && styles.menuButtonActive]}
        onPress={onToggleMenu}
        activeOpacity={0.75}
        accessibilityLabel="Abrir menú lateral"
      >
        <View style={styles.burgerLines}>
          <View style={styles.burgerLine} />
          <View style={[styles.burgerLine, styles.burgerLineMiddle]} />
          <View style={styles.burgerLine} />
        </View>
        <Text style={styles.menuLabel}>{menuOpen ? 'Cerrar' : 'Menú'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#1e1b4b',
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#312e81',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    marginRight: 10,
  },
  logoBadge: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#4f46e5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#818cf8',
  },
  logoText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 15,
    letterSpacing: 0.5,
  },
  brandTextWrap: {
    flex: 1,
  },
  brand: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  subtitle: {
    color: '#a5b4fc',
    fontSize: 11,
    marginTop: 2,
    fontWeight: '500',
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: '#4f46e5',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#818cf8',
  },
  menuButtonActive: {
    backgroundColor: '#4338ca',
  },
  burgerLines: {
    width: 16,
    height: 13,
    justifyContent: 'space-between',
  },
  burgerLine: {
    width: 16,
    height: 2.2,
    backgroundColor: '#ffffff',
    borderRadius: 2,
  },
  burgerLineMiddle: {
    width: 12,
  },
  menuLabel: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
});
