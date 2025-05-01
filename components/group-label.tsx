"use client"

import { memo, useEffect, useState } from "react"
import { archiveObjects } from "../data/objects"

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
  const [label, setLabel] = useState("Group")
  const [isClient, setIsClient] = useState(false)

  // Set isClient to true after mount to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return // Skip on server-side

    const groupItems = items
      .filter((item) => group.items.includes(item.id))
      .map(item => {
        const archiveObj = archiveObjects.find(obj => obj.id === `object-${item.id}`)
        return archiveObj ? {
          city: archiveObj.city,
          year: archiveObj.year,
          type: archiveObj.type,
          name: archiveObj.name,
        } : {
          city: "",
          year: "",
          type: "",
          name: "",
        }
      })

    // Only make API call if we have valid items
    if (groupItems.length > 0 && groupItems.some(i => i.city || i.year || i.type || i.name)) {
      fetch("/api/generate-group-name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: groupItems }),
      })
        .then(res => res.json())
        .then(data => {
          console.log("Gemini API response:", data);
          setLabel(data.groupName || "Group");
        })
        .catch(error => {
          console.error("Error fetching group name:", error);
          setLabel("Group");
        });
    }
  }, [group.items.join(","), isClient])

  // Don't show labels for single items
  if (group.isSingle) {
    return null
  }

  return (
    <div
      style={{
        position: "absolute",
        bottom: "-8px",
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
        fontSize: "16px",
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
