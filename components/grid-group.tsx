"use client"

import { useState } from "react"
import DraggableGridItem from "./draggable-grid-item"

interface Image {
  id: string
  src: string
  alt: string
}

interface GridGroupProps {
  id: string
  color: string
  position: {
    top: string
    left: string
  }
  width: string
  height: string
  images: Image[]
}

export default function GridGroup({ id, color, position, width, height, images }: GridGroupProps) {
  // Calculate grid positions
  const gridSize = 100 // Size of each grid cell
  const gridGap = 10 // Gap between grid cells
  const cols = Math.floor((Number.parseInt(width) + gridGap) / (gridSize + gridGap))

  // Initialize positions in a grid layout
  const [gridItems, setGridItems] = useState(
    images.map((image, index) => {
      const col = index % cols
      const row = Math.floor(index / cols)
      return {
        ...image,
        position: {
          x: col * (gridSize + gridGap),
          y: row * (gridSize + gridGap),
        },
      }
    }),
  )

  return (
    <div
      className="absolute rounded-lg"
      style={{
        top: position.top,
        left: position.left,
        width,
        height,
        backgroundColor: color,
        padding: `${gridGap}px`,
      }}
    >
      <div className="relative w-full h-full" id={`group-${id}`}>
        {gridItems.map((item) => (
          <DraggableGridItem
            key={item.id}
            id={item.id}
            src={item.src}
            alt={item.alt}
            initialPosition={item.position}
            groupBounds={`#group-${id}`}
            gridSize={gridSize}
            gridGap={gridGap}
          />
        ))}
      </div>
    </div>
  )
}
