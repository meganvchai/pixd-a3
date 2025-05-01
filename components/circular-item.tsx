"use client"

import { memo } from "react"
import Image from "next/image"
import { CSSProperties } from "react"

interface Item {
  id: number
  type: string
  groupId: number
  x: number
  y: number
  size: number
}

type ImageType = 
  | "carbone" | "bigsur" | "calpig" | "daytrip" | "dishoom" 
  | "gudetama" | "fournee" | "berkeley" | "centralpark" | "cat"
  | "matcha" | "moma" | "jr" | "nyMetro" | "tenryuji"
  | "volleyball" | "pickle" | "recycle" | "whiteWhale" | "pittsburgh"
  | "helloKitty" | "miffy" | "olive"

interface CircularItemProps {
  item: Item
  isBeingDragged: boolean
  isDeleteMode: boolean
  onMouseDown: (e: React.MouseEvent, item: Item) => void
  isFaded: boolean
  groupId: string
  onMouseEnter: () => void
  onMouseLeave: () => void
}

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
}: CircularItemProps) {
  const style: CSSProperties = {
    position: "absolute",
    left: `${item.x - item.size / 2}px`,
    top: `${item.y - item.size / 2}px`,
    width: `${item.size}px`,
    height: `${item.size}px`,
    cursor: isDeleteMode ? "not-allowed" : "move",
    // Remove transition when dragging to prevent lag
    transition: isBeingDragged ? "none" : "transform 0.2s ease, box-shadow 0.2s ease, opacity 0.3s ease-in-out",
    transform: isBeingDragged ? "scale(1.1)" : "scale(1)",
    zIndex: isBeingDragged ? 100 : 2,
    opacity: isFaded ? 0.5 : 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    pointerEvents: "auto",
  }

  // Get image path based on item type
  const getImagePath = (type: string): string => {
    const imageMap: Record<ImageType, string> = {
      carbone: "/images/objects/carbone.png",
      bigsur: "/images/objects/big sur picture.png",
      calpig: "/images/objects/cal pig.png",
      daytrip: "/images/objects/daytrip.png",
      dishoom: "/images/objects/dishoom.png",
      gudetama: "/images/objects/gudetama card.png",
      fournee: "/images/objects/fournee.png",
      berkeley: "/images/objects/berkeley postcard.png",
      centralpark: "/images/objects/central park.png",
      cat: "/images/objects/cat.png",
      matcha: "/images/objects/matcha.png",
      moma: "/images/objects/moma.png",
      jr: "/images/objects/jr.png",
      nyMetro: "/images/objects/ny metro card.png",
      tenryuji: "/images/objects/tenryuji temple.png",
      volleyball: "/images/objects/volleyball.png",
      pickle: "/images/objects/pickle bookstore.png",
      recycle: "/images/objects/recycle book store.png",
      whiteWhale: "/images/objects/white whale.png",
      pittsburgh: "/images/objects/pittsburgh ballet.png",
      helloKitty: "/images/objects/hello kitty.png",
      miffy: "/images/objects/miffy.png",
      olive: "/images/objects/olive jellycat.png"
    }
    return imageMap[type as ImageType] || "/placeholder.svg"
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
          borderRadius: "50%",
          overflow: "hidden",
        }}
      >
        <Image
          src={getImagePath(item.type) || "/placeholder.svg"}
          alt={item.type}
          fill
          style={{ 
            objectFit: "contain"
          }}
        />
      </div>
    </div>
  )
})

export default CircularItem
