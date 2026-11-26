import React, { useState } from 'react';
import { StyleSheet, ScrollView, StatusBar, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import Header from './src/components/Header';
import HamburgerMenu from './src/components/HamburgerMenu';
import NavBar from './src/components/NavBar';
import Footer from './src/components/Footer';

import CatalogScreen from './src/screens/CatalogScreen';
import CartScreen from './src/screens/CartScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import LoginScreen from './src/screens/LoginScreen';
import UsersPanelScreen from './src/screens/UsersPanelScreen';

export default function App() {
  // 'catalog' | 'cart' | 'register' | 'login' | 'users'
  const [currentRoute, setCurrentRoute] = useState('catalog');
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  const totalCartUnits = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleAddToCart = (product) => {
    setCartItems((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleDecrementFromCart = (productId) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleNavigate = (route) => {
    if (route === 'users' && !currentUser) {
      setCurrentRoute('login');
      setMenuOpen(false);
      return;
    }
    setCurrentRoute(route);
    setMenuOpen(false);
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setCurrentRoute('users');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentRoute('catalog');
    setMenuOpen(false);
  };

  const renderWorkArea = () => {
    switch (currentRoute) {
      case 'cart':
        return (
          <CartScreen
            cartItems={cartItems}
            onIncrement={handleAddToCart}
            onDecrement={handleDecrementFromCart}
            onRemoveItem={handleRemoveFromCart}
            onClearCart={handleClearCart}
            onGoToCatalog={() => setCurrentRoute('catalog')}
          />
        );
      case 'register':
        return (
          <RegisterScreen
            onRegistered={() => setCurrentRoute('login')}
            onGoToLogin={() => setCurrentRoute('login')}
          />
        );
      case 'login':
        return (
          <LoginScreen
            onLoginSuccess={handleLoginSuccess}
            onGoToRegister={() => setCurrentRoute('register')}
          />
        );
      case 'users':
        return currentUser ? (
          <UsersPanelScreen
            currentUser={currentUser}
            onGoToCatalogAdmin={() => setCurrentRoute('catalog')}
          />
        ) : (
          <LoginScreen
            onLoginSuccess={handleLoginSuccess}
            onGoToRegister={() => setCurrentRoute('register')}
          />
        );
      case 'catalog':
      default:
        return (
          <CatalogScreen
            currentUser={currentUser}
            cartItems={cartItems}
            onAddToCart={handleAddToCart}
            onDecrementFromCart={handleDecrementFromCart}
            onRemoveFromCart={handleRemoveFromCart}
            onOpenCart={() => setCurrentRoute('cart')}
          />
        );
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#1e1b4b" />

        <Header
          brandName="Andina Tech & Hogar"
          menuOpen={menuOpen}
          onToggleMenu={() => setMenuOpen((prev) => !prev)}
        />

        <NavBar
          currentRoute={currentRoute}
          isAuthenticated={Boolean(currentUser)}
          cartCount={totalCartUnits}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />

        <View style={styles.bodyWrap}>
          <ScrollView style={styles.workArea} contentContainerStyle={styles.workAreaContent}>
            {renderWorkArea()}
          </ScrollView>

          <HamburgerMenu
            visible={menuOpen}
            currentRoute={currentRoute}
            currentUser={currentUser}
            cartCount={totalCartUnits}
            onClose={() => setMenuOpen(false)}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
        </View>

        <Footer
          teamCredits="Desarrollado por Ana Laura Valencia • Andina Tech & Hogar"
          year={2026}
          version="v1.0.0"
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1e1b4b',
  },
  bodyWrap: {
    flex: 1,
    position: 'relative',
  },
  workArea: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  workAreaContent: {
    padding: 16,
    flexGrow: 1,
  },
});
