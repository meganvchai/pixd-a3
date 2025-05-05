"use client"

import { CSSProperties } from "react"

interface Item {
  id: string
  x: number
  y: number
  width: number
  height: number
  type: string
}

interface Group {
  id: string
  items: string[]
  isSingle: boolean
}

interface GridItemProps {
  item: Item
  isBeingDragged: boolean
  isDeleteMode: boolean
  onMouseDown: (e: React.MouseEvent, item: Item) => void
  getGridCellColor: (id: string) => string
  groups: Group[]
  gridSize: number
}

export default function GridItem({
  item,
  isBeingDragged,
  isDeleteMode,
  onMouseDown,
  getGridCellColor,
  groups,
  gridSize,
}: GridItemProps) {
  // Find if this item is part of a group with multiple items
  const group = groups.find((g) => g.items.includes(item.id))
  const isSingleItem = !group || group.isSingle

  // For dragged items or single items, render a circular blob
  const isCircleBlob = isBeingDragged || isSingleItem

  const size = gridSize * 1.4 // Slightly larger than the grid cell
  const blobRadius = isCircleBlob ? "50%" : "15px" // Circle for single items, rounded square for groups

  // Calculate grid position
  const gridX = Math.round(item.x / gridSize)
  const gridY = Math.round(item.y / gridSize)

  // Center the blob around the item for single/dragged items
  const blobLeft = isCircleBlob ? gridX * gridSize + gridSize / 2 - size / 2 : (gridX - 0.2) * gridSize

  const blobTop = isCircleBlob ? gridY * gridSize + gridSize / 2 - size / 2 : (gridY - 0.2) * gridSize

  const individualBlobStyle: CSSProperties = {
    position: "absolute",
    left: `${blobLeft}px`,
    top: `${blobTop}px`,
    width: `${size}px`,
    height: `${size}px`,
    backgroundColor: getGridCellColor(item.id),
    borderRadius: blobRadius,
    zIndex: 0,
    transition: isBeingDragged ? "none" : "all 0.3s ease-out",
  }

  const style: CSSProperties = {
    position: "absolute",
    left: `${item.x}px`,
    top: `${item.y}px`,
    width: `${item.width}px`,
    height: `${item.height}px`,
    cursor: isDeleteMode ? "not-allowed" : "move",
    transition: isBeingDragged ? "none" : "all 0.3s ease",
    zIndex: isBeingDragged ? 100 : 10,
    boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
    backgroundColor: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "4px",
    border: isDeleteMode ? "2px dashed red" : "none",
  }

  let content
  switch (item.type) {
    case "metrocard":
      content = (
        <div className="flex flex-col items-center justify-center bg-blue-500 text-white font-bold rounded-sm w-full h-full">
          <div className="text-xs">MTA</div>
          <div className="text-sm">MetroCard</div>
        </div>
      )
      break
    case "ticket":
      content = (
        <div className="bg-gray-100 p-1 text-xs flex flex-col justify-between h-full rounded-sm">
          <div>TICKET</div>
          <div className="text-center text-xs">01/28/24</div>
        </div>
      )
      break
    case "businesscard":
      content = (
        <div className="bg-white p-1 text-xs flex flex-col justify-center items-center h-full border border-gray-300">
          <div>BUSINESS</div>
          <div>123-456-7890</div>
        </div>
      )
      break
    case "plushie":
      content = (
        <div className="bg-pink-200 rounded-full w-full h-full flex items-center justify-center">
          <div className="w-3/4 h-3/4 bg-pink-300 rounded-full relative">
            <div className="absolute top-1/4 left-1/4 w-1/4 h-1/4 bg-black rounded-full"></div>
            <div className="absolute top-1/4 right-1/4 w-1/4 h-1/4 bg-black rounded-full"></div>
          </div>
        </div>
      )
      break
    case "photo":
      content = (
        <div className="bg-indigo-100 w-full h-full flex items-center justify-center p-1">
          <div className="w-full h-full bg-blue-200"></div>
        </div>
      )
      break
    case "bookmark":
      content = (
        <div className="bg-yellow-800 w-full h-full flex flex-col items-center justify-start p-1 text-white text-xs">
          <span>BOOK</span>
          <span>MARK</span>
        </div>
      )
      break
    case "bakery":
      content = (
        <div className="flex flex-col items-center justify-center font-serif w-full h-full border border-gray-300 bg-gray-50">
          <div className="text-xs font-bold">FOURNÉE</div>
          <div className="text-xs">BAKERY</div>
        </div>
      )
      break
    case "art":
      content = (
        <div className="bg-white w-full h-full p-1">
          <div className="w-full h-full bg-green-200 flex">
            <div className="w-1/2 h-full bg-blue-300"></div>
          </div>
        </div>
      )
      break
    case "hotel":
      content = (
        <div className="bg-green-100 w-full h-full p-1">
          <div className="w-full h-full bg-red-50 border border-green-300"></div>
        </div>
      )
      break
    case "tea":
      content = (
        <div className="bg-green-800 text-white w-full h-full flex items-center justify-center rounded-full text-xs">
          <span>茶</span>
        </div>
      )
      break
    default:
      content = <div>{item.type}</div>
  }

  return (
    <>
      {/* Render individual blob for single/dragged items */}
      {(isBeingDragged || isSingleItem) && <div style={individualBlobStyle} />}
      <div key={item.id} style={style} onMouseDown={(e) => onMouseDown(e, item)}>
        {content}
      </div>
    </>
  )
}
