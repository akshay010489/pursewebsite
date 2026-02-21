'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { CartItem } from '@/app/page'
import { isAuthenticated } from '@/lib/auth'

interface CartProps {
  cart: CartItem[]
  onClose: () => void
  onRemove: (productId: string) => void
  onUpdateQuantity: (productId: string, quantity: number) => void
  totalPrice: number
}

export default function Cart({
  cart,
  onClose,
  onRemove,
  onUpdateQuantity,
  totalPrice,
}: CartProps) {
  const router = useRouter()

  const handleCheckout = () => {
    if (!isAuthenticated()) {
      router.push('/login')
      onClose()
      return
    }
    router.push('/checkout')
    onClose()
  }

  return (
    <div className="cart-modal" onClick={onClose}>
      <div className="cart-content" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h2 className="cart-title">Shopping Cart</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="empty-cart">
            <p>Your cart is empty</p>
          </div>
        ) : (
          <>
            {cart.map((item) => {
              const getImageSrc = () => {
                if (item.images && item.images.length > 0) {
                  return `/${item.images[0]}`
                }
                return item.image.startsWith('/') ? item.image : `/${item.image}`
              }
              
              return (
              <div key={item.id} className="cart-item">
                <div className="cart-item-image">
                  <Image
                    src={getImageSrc()}
                    alt={item.name}
                    width={100}
                    height={100}
                    className="cart-item-img"
                    unoptimized
                  />
                </div>
                <div className="cart-item-info">
                  <h3 className="cart-item-title">{item.name}</h3>
                  <div className="cart-item-price">
                    ${item.price.toFixed(2)} × {item.quantity}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      style={{
                        background: '#e2e8f0',
                        border: 'none',
                        borderRadius: '4px',
                        width: '30px',
                        height: '30px',
                        cursor: 'pointer',
                        fontSize: '1.2rem'
                      }}
                    >
                      −
                    </button>
                    <span style={{ minWidth: '30px', textAlign: 'center' }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      style={{
                        background: '#e2e8f0',
                        border: 'none',
                        borderRadius: '4px',
                        width: '30px',
                        height: '30px',
                        cursor: 'pointer',
                        fontSize: '1.2rem'
                      }}
                    >
                      +
                    </button>
                    <button
                      onClick={() => onRemove(item.id)}
                      style={{
                        marginLeft: 'auto',
                        background: '#f56565',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '0.25rem 0.75rem',
                        cursor: 'pointer',
                        fontSize: '0.875rem'
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
              )
            })}

            <div className="cart-total">
              <span className="total-label">Total:</span>
              <span className="total-amount">${totalPrice.toFixed(2)}</span>
            </div>

            {!isAuthenticated() && (
              <div style={{ 
                background: '#fff3cd', 
                color: '#856404', 
                padding: '0.75rem', 
                borderRadius: '8px', 
                marginBottom: '1rem',
                textAlign: 'center',
                fontSize: '0.9rem'
              }}>
                Please <Link href="/login" style={{ color: '#667eea', fontWeight: '600' }}>login</Link> or <Link href="/signup" style={{ color: '#667eea', fontWeight: '600' }}>sign up</Link> to checkout
              </div>
            )}
            <button 
              className="checkout-button" 
              onClick={handleCheckout}
              disabled={!isAuthenticated()}
              style={{ 
                opacity: !isAuthenticated() ? 0.6 : 1,
                cursor: !isAuthenticated() ? 'not-allowed' : 'pointer'
              }}
            >
              {isAuthenticated() ? 'Proceed to Checkout' : 'Login Required'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
