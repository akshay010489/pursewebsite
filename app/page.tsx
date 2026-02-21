'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Cart from '@/components/Cart'
import ProductCard from '@/components/ProductCard'
import { getCurrentUser } from '@/lib/auth'

export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  images?: string[]
  video?: string
}

export interface CartItem extends Product {
  quantity: number
}

const product: Product = {
  id: '1',
  name: 'Traditional Indian Purse',
  description: 'Beautifully crafted traditional Indian purse featuring exquisite design and premium materials. This elegant handbag combines traditional Indian artistry with modern functionality, perfect for any occasion.',
  price: 20.00,
  image: 'purse/IMG_6042.jpeg',
  images: [
    'purse/IMG_6042.jpeg',
    'purse/IMG_6043.jpeg',
    'purse/IMG_6044.jpeg',
    'purse/IMG_6045.jpeg'
  ],
  video: 'purse/Social_Media_Reel_For_Purse.mp4'
}

export default function Home() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [user, setUser] = useState(getCurrentUser())

  useEffect(() => {
    // Check for user changes
    const checkUser = () => {
      setUser(getCurrentUser())
    }
    checkUser()
    // Check every second for user changes (simple approach)
    const interval = setInterval(checkUser, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  useEffect(() => {
    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id)
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prevCart, { ...product, quantity: 1 }]
    })
    setIsCartOpen(true)
  }

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    )
  }

  const getTotalItems = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  return (
    <div>
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo">✨ Purse Boutique</div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              {user ? (
                <>
                  <Link href="/account" style={{ color: '#667eea', textDecoration: 'none', fontWeight: '600' }}>
                    My Account
                  </Link>
                  <button
                    className="cart-button"
                    onClick={() => setIsCartOpen(true)}
                  >
                    🛒 Cart
                    {getTotalItems() > 0 && (
                      <span className="cart-badge">{getTotalItems()}</span>
                    )}
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" style={{ color: '#667eea', textDecoration: 'none', fontWeight: '600' }}>
                    Login
                  </Link>
                  <Link href="/signup" style={{ color: '#667eea', textDecoration: 'none', fontWeight: '600' }}>
                    Sign Up
                  </Link>
                  <button
                    className="cart-button"
                    onClick={() => setIsCartOpen(true)}
                  >
                    🛒 Cart
                    {getTotalItems() > 0 && (
                      <span className="cart-badge">{getTotalItems()}</span>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          <h1 style={{
            textAlign: 'center',
            color: 'white',
            fontSize: '3rem',
            marginBottom: '1rem',
            textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
          }}>
            Luxury Purses Collection
          </h1>
          <p style={{
            textAlign: 'center',
            color: 'rgba(255,255,255,0.9)',
            fontSize: '1.2rem',
            marginBottom: '2rem'
          }}>
            Discover our exquisite collection of premium handbags
          </p>

          <div className="product-grid">
            <ProductCard product={product} onAddToCart={addToCart} />
          </div>
        </div>
      </main>

      {isCartOpen && (
        <Cart
          cart={cart}
          onClose={() => setIsCartOpen(false)}
          onRemove={removeFromCart}
          onUpdateQuantity={updateQuantity}
          totalPrice={getTotalPrice()}
        />
      )}
    </div>
  )
}
