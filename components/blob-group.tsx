"use client"

import DraggableImage from "./draggable-image"

interface Image {
  id: string
  src: string
  alt: string
  position: {
    x: number
    y: number
  }
}

interface BlobGroupProps {
  id: string
  color: string
  shape: string
  position: {
    top: string
    left: string
  }
  width: string
  height: string
  images: Image[]
}

export default function BlobGroup({ id, color, shape, position, width, height, images }: BlobGroupProps) {
  return (
    <div
      className="absolute"
      style={{
        top: position.top,
        left: position.left,
        width,
        height,
      }}
    >
      {/* SVG Blob Background */}
      <svg
        className="absolute top-0 left-0 w-full h-full"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        style={{ zIndex: 0 }}
      >
        <path fill={color} d={shape} transform="translate(0 0)" />
      </svg>

      {/* Container for draggable images */}
      <div className="relative w-full h-full" id={`group-${id}`}>
        {images.map((image) => (
          <DraggableImage
            key={image.id}
            id={image.id}
            src={image.src}
            alt={image.alt}
            initialPosition={image.position}
            groupBounds={`#group-${id}`}
          />
        ))}
      </div>
    </div>
  )
}
