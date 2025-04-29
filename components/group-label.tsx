"use client"

import { memo } from "react"
import { generateGroupLabel } from "@/lib/item-attributes"

interface GroupLabelProps {
  group: {
    id: number
    x: number
    y: number
    width: number
    height: number
    items: number[]
    itemPositions: any[]
    isSingle: boolean
  }
  items: any[]
  isVisible: boolean
}

const GroupLabel = memo(function GroupLabel({ group, items, isVisible }: GroupLabelProps) {
  // Find the items in this group
  const groupItems = items.filter((item) => group.items.includes(item.id))

  // Get the item types
  const itemTypes = groupItems.map((item) => item.type)

  // Generate a label based on common attributes
  const label = generateGroupLabel(itemTypes)

  // Don't show labels for single items
  if (group.isSingle) {
    return null
  }

  return (
    <div
      className="absolute px-2 py-1 bg-white bg-opacity-80 rounded text-xs font-medium shadow-sm"
      style={{
        top: group.height - 24,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 5,
        whiteSpace: "nowrap",
        maxWidth: "90%",
        overflow: "hidden",
        textOverflow: "ellipsis",
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.2s ease-in-out",
        pointerEvents: "none",
      }}
    >
      {label}
    </div>
  )
})

export default GroupLabel
