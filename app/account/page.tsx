'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser, updateUserAddress, logout } from '@/lib/auth'
import Link from 'next/link'

export default function AccountPage() {
  const router = useRouter()
  const [user, setUser] = useState(getCurrentUser())
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'USA'
  })
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    if (user.address) {
      setAddress(user.address)
    }
  }, [user, router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSaved(false)

    const success = updateUserAddress(address)
    
    if (success) {
      setUser(getCurrentUser())
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
    
    setLoading(false)
  }

  const handleLogout = () => {
    logout()
    router.push('/')
    router.refresh()
  }

  if (!user) {
    return null
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '2rem 0' }}>
      <header className="header">
        <div className="container">
          <div className="header-content">
            <Link href="/" style={{ textDecoration: 'none' }}>
              <div className="logo">✨ Purse Boutique</div>
            </Link>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <Link href="/" style={{ color: '#667eea', textDecoration: 'none', fontWeight: '600' }}>
                Home
              </Link>
              <button
                onClick={handleLogout}
                style={{
                  background: '#f56565',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="checkout-page" style={{ maxWidth: '600px', margin: '2rem auto' }}>
        <h1 className="checkout-title">My Account</h1>

        <div className="checkout-section">
          <h2 className="section-title">Account Information</h2>
          <div className="form-group">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-input"
              value={user.name}
              disabled
              style={{ background: '#f7fafc', cursor: 'not-allowed' }}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              value={user.email}
              disabled
              style={{ background: '#f7fafc', cursor: 'not-allowed' }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="checkout-section">
            <h2 className="section-title">Shipping Address</h2>
            <p style={{ color: '#718096', marginBottom: '1rem', fontSize: '0.9rem' }}>
              Save your address for faster checkout. Shipping fees are calculated based on distance from Newark, CA.
            </p>

            {saved && (
              <div className="success-message" style={{ marginBottom: '1rem' }}>
                Address saved successfully!
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Street Address</label>
              <input
                type="text"
                className="form-input"
                required
                value={address.street}
                onChange={(e) => setAddress({ ...address, street: e.target.value })}
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
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  placeholder="San Francisco"
                />
              </div>
              <div className="form-group">
                <label className="form-label">State</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  placeholder="CA"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">ZIP Code</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  value={address.zip}
                  onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                  placeholder="94000"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Country</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  value={address.country}
                  onChange={(e) => setAddress({ ...address, country: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit"
              className="checkout-button"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Address'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
