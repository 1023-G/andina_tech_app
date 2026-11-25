import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Footer({ teamCredits, year, version }) {
  return (
    <View style={styles.footer}>
      <Text style={styles.text}>
        {teamCredits}
      </Text>
      <Text style={styles.subtext}>
        Año {year} • Versión {version}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    backgroundColor: '#1e1b4b',
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#312e81',
  },
  text: {
    color: '#e0e7ff',
    fontSize: 12,
    fontWeight: '600',
  },
  subtext: {
    color: '#a5b4fc',
    fontSize: 11,
    marginTop: 2,
  },
});
