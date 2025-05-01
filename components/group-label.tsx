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
      style={{
        position: "absolute",
        top: -30,
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
        fontFamily: "HAL Timezone Unlicensed, sans-serif",
        fontSize: "18px",
        textAlign: "center",
        padding: "4px 8px",
        color: "#000000",
      }}
    >
      {/* Shadow text layer */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          color: "#F4AEC8",
          WebkitTextStroke: "6px #F4AEC8",
          filter: "blur(12px)",
          zIndex: -1,
        }}
      >
        {label}
      </div>
      {/* Main text layer */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {label}
      </div>
    </div>
  )
})

export default GroupLabel
