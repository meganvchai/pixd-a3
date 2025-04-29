"use client"
import DraggableImage from "./draggable-image"

interface Image {
  id: string
  src: string
  alt: string
}

interface ImageGroupProps {
  backgroundColor: string
  images: Image[]
}

export default function ImageGroup({ backgroundColor, images }: ImageGroupProps) {
  return (
    <div className="relative p-4 rounded-lg min-h-[300px]" style={{ backgroundColor }}>
      {images.map((image) => (
        <DraggableImage key={image.id} id={image.id} src={image.src} alt={image.alt} groupBounds=".group-boundary" />
      ))}
      <div className="group-boundary absolute inset-0"></div>
    </div>
  )
}
