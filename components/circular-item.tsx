"use client"

import { memo } from "react"
import Image from "next/image"

// Use memo to prevent unnecessary re-renders
const CircularItem = memo(function CircularItem({
  item,
  isBeingDragged,
  isDeleteMode,
  onMouseDown,
  isFaded,
  groupId,
  onMouseEnter,
  onMouseLeave,
}) {
  const style = {
    position: "absolute",
    left: `${item.x - item.size / 2}px`,
    top: `${item.y - item.size / 2}px`,
    width: `${item.size}px`,
    height: `${item.size}px`,
    cursor: isDeleteMode ? "not-allowed" : "move",
    // Remove transition when dragging to prevent lag
    transition: isBeingDragged ? "none" : "transform 0.2s ease, box-shadow 0.2s ease, opacity 0.3s ease-in-out",
    transform: isBeingDragged ? "scale(1.1)" : "scale(1)",
    zIndex: isBeingDragged ? 100 : 10,
    opacity: isFaded ? 0.5 : 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  }

  // Get image path based on item type
  const getImagePath = (type) => {
    const imageMap = {
      carbone: "/images/carbone.png",
      bigsur: "/images/big-sur-picture.png",
      calpig: "/images/cal-pig.png",
      daytrip: "/images/daytrip.png",
      dishoom: "/images/dishoom.png",
      gudetama: "/images/gudetama-card.png",
      fournee: "/images/fournee.png",
      berkeley: "/images/berkeley-postcard.png",
      centralpark: "/images/central-park-postcard.png",
      cat: "/images/cat.png",
    }
    return imageMap[type] || "/placeholder.svg"
  }

  return (
    <div
      style={style}
      onMouseDown={(e) => onMouseDown(e, item)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          filter: isDeleteMode ? "grayscale(100%) opacity(50%)" : "none",
          boxShadow: isDeleteMode ? "0 0 0 2px red" : "none",
          transition: isBeingDragged ? "none" : "all 0.2s ease",
        }}
      >
        <Image
          src={getImagePath(item.type) || "/placeholder.svg"}
          alt={item.type}
          fill
          style={{ objectFit: "contain" }}
        />
      </div>
    </div>
  )
})

export default CircularItem
