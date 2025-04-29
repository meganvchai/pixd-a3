"use client"

import { useState, useRef } from "react"
import Draggable from "react-draggable"
import Image from "next/image"

interface DraggableImageProps {
  id: string
  src: string
  alt: string
  initialPosition: {
    x: number
    y: number
  }
  groupBounds: string
}

export default function DraggableImage({ id, src, alt, initialPosition, groupBounds }: DraggableImageProps) {
  const [position, setPosition] = useState(initialPosition)
  const [isDragging, setIsDragging] = useState(false)
  const nodeRef = useRef(null)

  const handleDrag = (e: any, data: any) => {
    setPosition({ x: data.x, y: data.y })
  }

  // Calculate random rotation between -5 and 5 degrees for a more natural look
  const rotation = Math.floor(Math.random() * 10) - 5

  return (
    <Draggable
      nodeRef={nodeRef}
      bounds={groupBounds}
      position={position}
      onDrag={handleDrag}
      onStart={() => setIsDragging(true)}
      onStop={() => setIsDragging(false)}
    >
      <div
        ref={nodeRef}
        className={`absolute cursor-grab ${isDragging ? "cursor-grabbing z-50" : "z-10"}`}
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: isDragging ? "none" : "box-shadow 0.2s ease",
          boxShadow: isDragging ? "0 8px 16px rgba(0,0,0,0.2)" : "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <div className="relative">
          <Image
            src={src || "/placeholder.svg"}
            alt={alt}
            width={src.includes("width=") ? Number.parseInt(src.split("width=")[1]) : 100}
            height={src.includes("height=") ? Number.parseInt(src.split("height=")[1]) : 100}
            className="rounded-sm"
            style={{ objectFit: "cover" }}
          />
        </div>
      </div>
    </Draggable>
  )
}
