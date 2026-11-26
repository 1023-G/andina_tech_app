import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

export default function CartScreen({
  cartItems,
  onIncrement,
  onDecrement,
  onRemoveItem,
  onClearCart,
  onGoToCatalog,
}) {
  const [orderCompleted, setOrderCompleted] = useState(false);

  const totalUnits = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + Number(item.precio) * item.quantity,
    0
  );

  const handleCheckout = () => {
    setOrderCompleted(true);
    setTimeout(() => {
      onClearCart();
    }, 400);
  };

  if (orderCompleted && cartItems.length === 0) {
    return (
      <View style={styles.emptyCard}>
        <Text style={styles.successIcon}>🎉</Text>
        <Text style={styles.emptyTitle}>¡Pedido Confirmado!</Text>
        <Text style={styles.emptySubtitle}>
          Tu solicitud de compra en Andina Tech & Hogar ha sido procesada con éxito.
        </Text>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => {
            setOrderCompleted(false);
            onGoToCatalog();
          }}
        >
          <Text style={styles.primaryBtnText}>Seguir Explorando el Catálogo</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (cartItems.length === 0) {
    return (
      <View style={styles.emptyCard}>
        <Text style={styles.emptyIcon}>🛒</Text>
        <Text style={styles.emptyTitle}>Tu carrito está vacío</Text>
        <Text style={styles.emptySubtitle}>
          Explora nuestro catálogo y selecciona los artículos que deseas agregar.
        </Text>
        <TouchableOpacity style={styles.primaryBtn} onPress={onGoToCatalog}>
          <Text style={styles.primaryBtnText}>Ir al Catálogo de Productos</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerBanner}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.badge}>RESUMEN DE COMPRA</Text>
            <Text style={styles.heading}>Mi Carrito ({totalUnits})</Text>
          </View>
          <TouchableOpacity style={styles.clearBtn} onPress={onClearCart}>
            <Text style={styles.clearBtnText}>🗑️ Vaciar todo</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.subheading}>
          Ajusta las cantidades o quita los productos que no necesites.
        </Text>
      </View>

      {cartItems.map((item) => {
        const subtotal = Number(item.precio) * item.quantity;
        return (
          <View key={item.id} style={styles.itemCard}>
            <Image source={{ uri: item.imagen_url }} style={styles.thumb} />
            <View style={styles.itemInfo}>
              <View style={styles.itemTopRow}>
                <Text style={styles.itemTitle} numberOfLines={2}>
                  {item.nombre}
                </Text>
                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={() => onRemoveItem(item.id)}
                >
                  <Text style={styles.removeBtnText}>✕ Quitar</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.unitPrice}>
                Unitario: ${Number(item.precio).toLocaleString('es-CO')}
              </Text>

              <View style={styles.controlsRow}>
                <View style={styles.qtyBox}>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => onDecrement(item.id)}
                  >
                    <Text style={styles.qtyBtnText}>−</Text>
                  </TouchableOpacity>
                  <Text style={styles.qtyValue}>{item.quantity}</Text>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => onIncrement(item)}
                  >
                    <Text style={styles.qtyBtnText}>+</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.subtotalText}>
                  ${subtotal.toLocaleString('es-CO')}
                </Text>
              </View>
            </View>
          </View>
        );
      })}

      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Artículos seleccionados:</Text>
          <Text style={styles.summaryValue}>{totalUnits} unidad(es)</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Envío estimado:</Text>
          <Text style={styles.freeShipping}>GRATIS</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>Total a pagar:</Text>
          <Text style={styles.totalValue}>
            ${totalPrice.toLocaleString('es-CO')}
          </Text>
        </View>

        <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
          <Text style={styles.checkoutBtnText}>✓ Confirmar Pedido</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    paddingBottom: 16,
  },
  headerBanner: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e0e7ff',
    gap: 4,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  badge: {
    fontSize: 10,
    fontWeight: '800',
    color: '#4f46e5',
    letterSpacing: 1,
  },
  heading: {
    fontSize: 21,
    fontWeight: '800',
    color: '#1e1b4b',
  },
  subheading: {
    fontSize: 13,
    color: '#64748b',
  },
  clearBtn: {
    backgroundColor: '#fef2f2',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  clearBtnText: {
    color: '#dc2626',
    fontSize: 12,
    fontWeight: '700',
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 12,
    alignItems: 'center',
  },
  thumb: {
    width: 78,
    height: 78,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
  },
  itemInfo: {
    flex: 1,
    gap: 4,
  },
  itemTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
    flex: 1,
  },
  removeBtn: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  removeBtnText: {
    color: '#b91c1c',
    fontSize: 11,
    fontWeight: '700',
  },
  unitPrice: {
    fontSize: 12,
    color: '#64748b',
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  qtyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  qtyBtn: {
    paddingHorizontal: 11,
    paddingVertical: 4,
  },
  qtyBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1e1b4b',
  },
  qtyValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
    paddingHorizontal: 8,
  },
  subtotalText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#4f46e5',
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#c7d2fe',
    gap: 8,
    marginTop: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '600',
  },
  summaryValue: {
    fontSize: 13,
    color: '#0f172a',
    fontWeight: '700',
  },
  freeShipping: {
    fontSize: 12,
    color: '#15803d',
    fontWeight: '800',
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1e1b4b',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#4f46e5',
  },
  checkoutBtn: {
    backgroundColor: '#10b981',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  checkoutBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
  emptyCard: {
    backgroundColor: '#ffffff',
    padding: 28,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e0e7ff',
    alignItems: 'center',
    gap: 10,
  },
  emptyIcon: {
    fontSize: 44,
  },
  successIcon: {
    fontSize: 48,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1e1b4b',
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 19,
  },
  primaryBtn: {
    backgroundColor: '#4f46e5',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 8,
  },
  primaryBtnText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 14,
  },
});
