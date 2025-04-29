"use client"

import { useState, useRef } from "react"
import Draggable from "react-draggable"
import Image from "next/image"

interface DraggableGridItemProps {
  id: string
  src: string
  alt: string
  initialPosition: {
    x: number
    y: number
  }
  groupBounds: string
  gridSize: number
  gridGap: number
}

export default function DraggableGridItem({
  id,
  src,
  alt,
  initialPosition,
  groupBounds,
  gridSize,
  gridGap,
}: DraggableGridItemProps) {
  const [position, setPosition] = useState(initialPosition)
  const [isDragging, setIsDragging] = useState(false)
  const nodeRef = useRef(null)

  // Handle drag events
  const handleDrag = (e: any, data: any) => {
    setPosition({ x: data.x, y: data.y })
  }

  // Snap to grid when drag ends
  const handleStop = (e: any, data: any) => {
    setIsDragging(false)

    // Calculate the nearest grid position
    const x = Math.round(data.x / (gridSize + gridGap)) * (gridSize + gridGap)
    const y = Math.round(data.y / (gridSize + gridGap)) * (gridSize + gridGap)

    setPosition({ x, y })
  }

  return (
    <Draggable
      nodeRef={nodeRef}
      bounds={groupBounds}
      position={position}
      onDrag={handleDrag}
      onStart={() => setIsDragging(true)}
      onStop={handleStop}
      grid={[gridSize + gridGap, gridSize + gridGap]}
    >
      <div
        ref={nodeRef}
        className={`absolute cursor-grab ${isDragging ? "cursor-grabbing z-50" : "z-10"}`}
        style={{
          width: `${gridSize}px`,
          height: `${gridSize}px`,
          transition: isDragging ? "none" : "box-shadow 0.2s ease, transform 0.1s ease",
          boxShadow: isDragging ? "0 8px 16px rgba(0,0,0,0.2)" : "0 2px 4px rgba(0,0,0,0.1)",
          transform: isDragging ? "scale(1.05)" : "scale(1)",
        }}
      >
        <div className="relative w-full h-full">
          <Image src={src || "/placeholder.svg"} alt={alt} fill className="rounded-md object-cover" />
        </div>
      </div>
    </Draggable>
  )
}
