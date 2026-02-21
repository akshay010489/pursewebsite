'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ImageGalleryProps {
  images: string[]
  video?: string
}

export default function ImageGallery({ images, video }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  // Put video first if it exists, then images
  const allMedia = video ? [video, ...images] : images
  const isVideo = (media: string) => {
    if (!media) return false
    const lower = media.toLowerCase()
    return lower.endsWith('.mp4') || lower.endsWith('.mov') || lower.endsWith('.webm') || lower.endsWith('.avi')
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? allMedia.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === allMedia.length - 1 ? 0 : prev + 1))
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <div className="image-gallery-container">
      <div className="image-gallery-main">
        <button className="gallery-nav-button gallery-nav-left" onClick={goToPrevious}>
          ‹
        </button>
        
        <div className="gallery-main-image">
          {isVideo(allMedia[currentIndex]) ? (
            <video
              src={`/${allMedia[currentIndex]}`}
              controls
              autoPlay={currentIndex === 0}
              loop
              muted={false}
              className="gallery-video"
              playsInline
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <Image
              src={`/${allMedia[currentIndex]}`}
              alt={`Product image ${currentIndex + 1}`}
              width={600}
              height={600}
              className="gallery-image"
              unoptimized
              priority={currentIndex === 0}
            />
          )}
        </div>
        
        <button className="gallery-nav-button gallery-nav-right" onClick={goToNext}>
          ›
        </button>
      </div>

      <div className="gallery-thumbnails">
        {allMedia.map((media, index) => (
          <div
            key={index}
            className={`gallery-thumbnail ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          >
            {isVideo(media) ? (
              <div className="thumbnail-video-wrapper">
                <video
                  src={`/${media}`}
                  className="thumbnail-video"
                  muted
                />
                <div className="play-icon">▶</div>
              </div>
            ) : (
              <Image
                src={`/${media}`}
                alt={`Thumbnail ${index + 1}`}
                width={80}
                height={80}
                className="thumbnail-image"
                unoptimized
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
