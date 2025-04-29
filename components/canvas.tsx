"use client"

import { useState } from "react"
import GridGroup from "./grid-group"

// Sample data for image groups
const initialGroups = [
  {
    id: "yellow-group",
    color: "#FFF4C2", // Light yellow
    position: { top: "0", left: "0" },
    width: "400px",
    height: "400px",
    images: [
      { id: "yellow-item-1", src: "/placeholder.svg?height=100&width=100", alt: "Item 1" },
      { id: "yellow-item-2", src: "/placeholder.svg?height=100&width=100", alt: "Item 2" },
      { id: "yellow-item-3", src: "/placeholder.svg?height=100&width=100", alt: "Item 3" },
      { id: "yellow-item-4", src: "/placeholder.svg?height=100&width=100", alt: "Item 4" },
      { id: "yellow-item-5", src: "/placeholder.svg?height=100&width=100", alt: "Item 5" },
      { id: "yellow-item-6", src: "/placeholder.svg?height=100&width=100", alt: "Item 6" },
    ],
  },
  {
    id: "blue-group",
    color: "#D9F1FF", // Light blue
    position: { top: "0", left: "420px" },
    width: "400px",
    height: "400px",
    images: [
      { id: "blue-item-1", src: "/placeholder.svg?height=100&width=100", alt: "Item 1" },
      { id: "blue-item-2", src: "/placeholder.svg?height=100&width=100", alt: "Item 2" },
      { id: "blue-item-3", src: "/placeholder.svg?height=100&width=100", alt: "Item 3" },
      { id: "blue-item-4", src: "/placeholder.svg?height=100&width=100", alt: "Item 4" },
      { id: "blue-item-5", src: "/placeholder.svg?height=100&width=100", alt: "Item 5" },
    ],
  },
  {
    id: "green-group",
    color: "#D9F5E4", // Light green
    position: { top: "420px", left: "0" },
    width: "400px",
    height: "400px",
    images: [
      { id: "green-item-1", src: "/placeholder.svg?height=100&width=100", alt: "Item 1" },
      { id: "green-item-2", src: "/placeholder.svg?height=100&width=100", alt: "Item 2" },
      { id: "green-item-3", src: "/placeholder.svg?height=100&width=100", alt: "Item 3" },
      { id: "green-item-4", src: "/placeholder.svg?height=100&width=100", alt: "Item 4" },
    ],
  },
  {
    id: "pink-group",
    color: "#FFD6D6", // Light pink/coral
    position: { top: "420px", left: "420px" },
    width: "400px",
    height: "400px",
    images: [
      { id: "pink-item-1", src: "/placeholder.svg?height=100&width=100", alt: "Item 1" },
      { id: "pink-item-2", src: "/placeholder.svg?height=100&width=100", alt: "Item 2" },
      { id: "pink-item-3", src: "/placeholder.svg?height=100&width=100", alt: "Item 3" },
      { id: "pink-item-4", src: "/placeholder.svg?height=100&width=100", alt: "Item 4" },
      { id: "pink-item-5", src: "/placeholder.svg?height=100&width=100", alt: "Item 5" },
      { id: "pink-item-6", src: "/placeholder.svg?height=100&width=100", alt: "Item 6" },
      { id: "pink-item-7", src: "/placeholder.svg?height=100&width=100", alt: "Item 7" },
    ],
  },
]

export default function Canvas() {
  const [groups, setGroups] = useState(initialGroups)

  return (
    <div className="relative w-full h-[840px]">
      {groups.map((group) => (
        <GridGroup
          key={group.id}
          id={group.id}
          color={group.color}
          position={group.position}
          width={group.width}
          height={group.height}
          images={group.images}
        />
      ))}
    </div>
  )
}
