'use client'

import { Product } from '@/app/page'
import ImageGallery from './ImageGallery'

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <div className="product-card">
      <div className="product-image-gallery">
        {product.images && product.images.length > 0 ? (
          <ImageGallery images={product.images} video={product.video} />
        ) : (
          <div className="product-image">
            {product.image}
          </div>
        )}
      </div>
      <div className="product-info">
        <h2 className="product-title">{product.name}</h2>
        <p className="product-description">{product.description}</p>
        <div className="product-price">${product.price.toFixed(2)}</div>
        <button
          className="add-to-cart-btn"
          onClick={() => onAddToCart(product)}
        >
          Add to Cart
        </button>
      </div>
    </div>
  )
}
