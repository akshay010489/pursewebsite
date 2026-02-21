'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { CartItem } from '../page'
import { getCurrentUser, isAuthenticated } from '@/lib/auth'
import { getShippingFeeFromAddress } from '@/lib/shipping'

const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null

function CheckoutForm() {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const [cart, setCart] = useState<CartItem[]>([])
  const [user, setUser] = useState(getCurrentUser())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [shippingFee, setShippingFee] = useState(0)
  const [calculatingShipping, setCalculatingShipping] = useState(false)
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
  })

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      router.push('/login')
      return
    }

    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push('/login')
      return
    }

    setUser(currentUser)

    // Load cart
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    } else {
      router.push('/')
      return
    }

    // Load saved address if available
    if (currentUser.address) {
      setCustomerInfo({
        name: currentUser.name,
        email: currentUser.email,
        address: currentUser.address.street,
        city: currentUser.address.city,
        state: currentUser.address.state,
        zip: currentUser.address.zip,
      })
    } else {
      setCustomerInfo({
        name: currentUser.name,
        email: currentUser.email,
        address: '',
        city: '',
        state: '',
        zip: '',
      })
    }
  }, [router])

  // Calculate shipping when address changes
  useEffect(() => {
    if (customerInfo.address && customerInfo.city && customerInfo.state && customerInfo.zip) {
      calculateShipping()
    } else {
      setShippingFee(0)
    }
  }, [customerInfo.address, customerInfo.city, customerInfo.state, customerInfo.zip])

  const calculateShipping = async () => {
    setCalculatingShipping(true)
    try {
      const result = await getShippingFeeFromAddress(
        customerInfo.address,
        customerInfo.city,
        customerInfo.state,
        customerInfo.zip
      )
      setShippingFee(result.fee)
      if (result.error) {
        console.warn(result.error)
      }
    } catch (err) {
      console.error('Shipping calculation error:', err)
      setShippingFee(20.00) // Default fee
    } finally {
      setCalculatingShipping(false)
    }
  }

  const getSubtotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  const getTotalPrice = () => {
    return getSubtotal() + shippingFee
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!stripe || !elements) {
      return
    }

    setLoading(true)

    try {
      // Create payment intent (including shipping)
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(getTotalPrice() * 100), // Convert to cents
          items: cart,
          customerInfo,
          shippingFee,
        }),
      })

      const { clientSecret, error: apiError } = await response.json()

      if (apiError) {
        setError(apiError)
        setLoading(false)
        return
      }

      // Confirm payment
      const cardElement = elements.getElement(CardElement)
      if (!cardElement) {
        setError('Card element not found')
        setLoading(false)
        return
      }

      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: customerInfo.name,
              email: customerInfo.email,
              address: {
                line1: customerInfo.address,
                city: customerInfo.city,
                state: customerInfo.state,
                postal_code: customerInfo.zip,
              },
            },
          },
        }
      )

      if (confirmError) {
        setError(confirmError.message || 'Payment failed')
        setLoading(false)
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        setSuccess(true)
        localStorage.removeItem('cart')
        setTimeout(() => {
          router.push('/')
        }, 3000)
      }
    } catch (err) {
      setError('An unexpected error occurred')
      setLoading(false)
    }
  }

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  }

  if (!user) {
    return <div className="loading">Redirecting to login...</div>
  }

  if (cart.length === 0 && !success) {
    return <div className="loading">Loading...</div>
  }

  if (success) {
    return (
      <div className="checkout-page">
        <div className="success-message">
          <h2>Payment Successful! 🎉</h2>
          <p>Your order has been processed. You will receive a confirmation email shortly.</p>
          <p>Redirecting to home page...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="checkout-page">
      <h1 className="checkout-title">Checkout</h1>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="checkout-section">
          <h2 className="section-title">Shipping Information</h2>
          <p style={{ color: '#718096', marginBottom: '1rem', fontSize: '0.9rem' }}>
            Shipping fees are calculated based on distance from Newark, CA.
            {user.address && (
              <span> Your saved address is pre-filled below.</span>
            )}
          </p>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-input"
              required
              value={customerInfo.name}
              onChange={(e) =>
                setCustomerInfo({ ...customerInfo, name: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              required
              value={customerInfo.email}
              onChange={(e) =>
                setCustomerInfo({ ...customerInfo, email: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label className="form-label">Address</label>
            <input
              type="text"
              className="form-input"
              required
              value={customerInfo.address}
              onChange={(e) =>
                setCustomerInfo({ ...customerInfo, address: e.target.value })
              }
              placeholder="123 Main St"
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">City</label>
              <input
                type="text"
                className="form-input"
                required
                value={customerInfo.city}
                onChange={(e) =>
                  setCustomerInfo({ ...customerInfo, city: e.target.value })
                }
                placeholder="San Francisco"
              />
            </div>
            <div className="form-group">
              <label className="form-label">State</label>
              <input
                type="text"
                className="form-input"
                required
                value={customerInfo.state}
                onChange={(e) =>
                  setCustomerInfo({ ...customerInfo, state: e.target.value })
                }
                placeholder="CA"
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">ZIP Code</label>
            <input
              type="text"
              className="form-input"
              required
              value={customerInfo.zip}
              onChange={(e) =>
                setCustomerInfo({ ...customerInfo, zip: e.target.value })
              }
              placeholder="94000"
            />
          </div>
          {calculatingShipping && (
            <p style={{ color: '#667eea', fontSize: '0.9rem' }}>Calculating shipping...</p>
          )}
        </div>

        <div className="checkout-section">
          <h2 className="section-title">Payment Information</h2>
          <div className="form-group">
            <label className="form-label">Card Details</label>
            <div
              style={{
                padding: '0.75rem',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                background: 'white',
              }}
            >
              <CardElement options={cardElementOptions} />
            </div>
          </div>
        </div>

        <div className="checkout-section">
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: '#718096' }}>Subtotal:</span>
              <span style={{ color: '#2d3748' }}>${getSubtotal().toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: '#718096' }}>Shipping:</span>
              <span style={{ color: '#2d3748' }}>
                {calculatingShipping ? 'Calculating...' : `$${shippingFee.toFixed(2)}`}
              </span>
            </div>
          </div>
          <div className="cart-total">
            <span className="total-label">Total Amount:</span>
            <span className="total-amount">
              ${calculatingShipping ? '...' : getTotalPrice().toFixed(2)}
            </span>
          </div>
        </div>

        <button
          type="submit"
          className="checkout-button"
          disabled={!stripe || loading || calculatingShipping}
        >
          {loading ? 'Processing...' : `Pay $${calculatingShipping ? '...' : getTotalPrice().toFixed(2)}`}
        </button>
      </form>
    </div>
  )
}

export default function CheckoutPage() {
  const router = useRouter()

  // Check authentication first
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login')
    }
  }, [router])

  if (!stripePublishableKey) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '2rem 0' }}>
        <header className="header">
          <div className="container">
            <div className="header-content">
              <Link href="/" style={{ textDecoration: 'none' }}>
                <div className="logo">✨ Purse Boutique</div>
              </Link>
            </div>
          </div>
        </header>
        <div className="checkout-page">
          <div className="error-message">
            <h2>⚠️ Stripe Not Configured</h2>
            <p>To enable payments, you need to set up Stripe API keys.</p>
            <ol style={{ textAlign: 'left', marginTop: '1rem', lineHeight: '2' }}>
              <li>Create a free Stripe account at <a href="https://stripe.com" target="_blank" rel="noopener noreferrer" style={{ color: 'white', textDecoration: 'underline' }}>stripe.com</a></li>
              <li>Get your API keys from <a href="https://dashboard.stripe.com/test/apikeys" target="_blank" rel="noopener noreferrer" style={{ color: 'white', textDecoration: 'underline' }}>Stripe Dashboard</a></li>
              <li>Create a file named <code>.env.local</code> in the project root</li>
              <li>Add these lines (replace with your actual keys):</li>
            </ol>
            <pre style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', marginTop: '1rem', textAlign: 'left', overflow: 'auto' }}>
{`STRIPE_SECRET_KEY=sk_test_your_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here`}
            </pre>
            <p style={{ marginTop: '1rem' }}>Then restart the server. See <code>STRIPE_SETUP.md</code> for detailed instructions.</p>
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated()) {
    return null // Will redirect
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '2rem 0' }}>
      <header className="header">
        <div className="container">
          <div className="header-content">
            <Link href="/" style={{ textDecoration: 'none' }}>
              <div className="logo">✨ Purse Boutique</div>
            </Link>
          </div>
        </div>
      </header>
      {stripePromise && (
        <Elements stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  )
}
