import React from 'react';
import './ImageGallery.css';

// REUSABLE COMPONENT: ImageGallery
// Used in: Property Details Page (Left Panel)

interface ImageGalleryProps {
  images: string[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  propertyTitle: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  currentIndex,
  onIndexChange,
  propertyTitle,
}) => {
  const hasImages = images && images.length > 0;

  const handlePrev = () => {
    if (hasImages) {
      onIndexChange(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (hasImages) {
      onIndexChange(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
    }
  };

  return (
    <div className="image-gallery">
      {/* Main large image display */}
      <div className="main-image">
        {hasImages ? (
          <>
            <img
              src={images[currentIndex]}
              alt={`${propertyTitle} - Image ${currentIndex + 1}`}
            />
            {images.length > 1 && (
              <>
                <button className="nav-button prev" onClick={handlePrev}>
                  ❮
                </button>
                <button className="nav-button next" onClick={handleNext}>
                  ❯
                </button>
                <div className="image-counter">
                  {currentIndex + 1} / {images.length}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="no-image-placeholder">
            <span className="placeholder-icon">📷</span>
            <p>No images available</p>
          </div>
        )}
      </div>

      {/* Below it, a horizontal row of small thumbnails */}
      {/* Clicking thumbnail updates the main image */}
      {hasImages && images.length > 1 && (
        <div className="thumbnail-strip">
          {images.map((image, index) => (
            <div
              key={index}
              className={`thumbnail ${index === currentIndex ? 'active' : ''}`}
              onClick={() => onIndexChange(index)}
            >
              <img src={image} alt={`Thumbnail ${index + 1}`} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
