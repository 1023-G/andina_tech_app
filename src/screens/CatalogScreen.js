import React, { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { fetchCatalogProducts } from '../lib/supabase';

const FALLBACK_PRODUCTS = [
  {
    id: 'fb-1',
    nombre: 'Smart TV 55" 4K Ultra HD',
    descripcion: 'Televisor inteligente con panel LED, HDR10 y sistema operativo integrado para streaming.',
    precio: 1699900,
    imagen_url: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'fb-2',
    nombre: 'Portátil Ultrabook Pro 14"',
    descripcion: 'Procesador de alto rendimiento, 16GB RAM, SSD 512GB y chasis ultraligero en aluminio.',
    precio: 2850000,
    imagen_url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'fb-3',
    nombre: 'Cafetera Espresso Automática',
    descripcion: 'Sistema de presión de 15 bares con espumador de leche profesional para el hogar.',
    precio: 649000,
    imagen_url: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=800&q=80',
  },
];

export default function CatalogScreen() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
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
    };

    load();
  }, []);

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
        <Text style={styles.heroBadge}>CATÁLOGO OFICIAL • ACCESO PÚBLICO</Text>
        <Text style={styles.heading}>Nuestros Productos</Text>
        <Text style={styles.subheading}>
          Explora las mejores ofertas en tecnología y hogar sin necesidad de crear cuenta.
        </Text>
      </View>

      {products.map((item) => (
        <View key={item.id} style={styles.card}>
          <View style={styles.imageWrap}>
            <Image source={{ uri: item.imagen_url }} style={styles.image} resizeMode="cover" />
            <View style={styles.tagPrice}>
              <Text style={styles.tagPriceText}>
                ${Number(item.precio).toLocaleString('es-CO')}
              </Text>
            </View>
          </View>
          <View style={styles.cardBody}>
            <View style={styles.stockRow}>
              <View style={styles.stockBadge}>
                <Text style={styles.stockText}>✓ Disponible</Text>
              </View>
              <Text style={styles.categoryText}>Andina Tech & Hogar</Text>
            </View>
            <Text style={styles.title}>{item.nombre}</Text>
            <Text style={styles.description}>{item.descripcion}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 14,
    paddingBottom: 12,
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
    gap: 4,
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
  cardBody: {
    padding: 16,
    gap: 6,
  },
  stockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
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
});
