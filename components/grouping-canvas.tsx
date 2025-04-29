"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import CircularItem from "./circular-item"
import BlobBackground from "./blob-background"
import GroupLabel from "./group-label"

export default function GroupingCanvas() {
  // Item settings
  const ITEM_SIZE = 100 // Increased from 80 to 100 for larger images
  const PROXIMITY_THRESHOLD = 80 // Distance threshold for grouping items

  // Define specific colors for group backgrounds
  const GROUP_COLORS = [
    "#EE7C87", // Pinkish-red
    "#FFFA9F", // Light yellow
    "#DBE7AB", // Light green
    "#93D4FF", // Light blue
    "#D3C3EB", // Light purple
    "#FECEDA", // Light pink
  ]

  // Define initial items with free positioning
  const initialItems = [
    { id: 1, type: "carbone", groupId: 1, x: 100, y: 150, size: ITEM_SIZE },
    { id: 2, type: "bigsur", groupId: 2, x: 500, y: 200, size: ITEM_SIZE },
    { id: 3, type: "calpig", groupId: 3, x: 350, y: 300, size: ITEM_SIZE },
    { id: 4, type: "daytrip", groupId: 3, x: 420, y: 280, size: ITEM_SIZE },
    { id: 5, type: "dishoom", groupId: 3, x: 390, y: 350, size: ITEM_SIZE },
    { id: 6, type: "gudetama", groupId: 1, x: 150, y: 180, size: ITEM_SIZE },
    { id: 7, type: "fournee", groupId: 4, x: 600, y: 400, size: ITEM_SIZE },
    { id: 8, type: "berkeley", groupId: 2, x: 550, y: 230, size: ITEM_SIZE },
    { id: 9, type: "centralpark", groupId: 5, x: 200, y: 350, size: ITEM_SIZE },
    { id: 10, type: "cat", groupId: 5, x: 150, y: 400, size: ITEM_SIZE },
  ]

  const [items, setItems] = useState(initialItems)
  const [draggingItem, setDraggingItem] = useState(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [isDeleteMode, setIsDeleteMode] = useState(false)
  const [groups, setGroups] = useState([])
  const [mergeAnimations, setMergeAnimations] = useState({})
  const [hoveredGroupId, setHoveredGroupId] = useState(null)

  // Store previous groups in a ref to avoid triggering re-renders
  const previousGroupsRef = useRef([])
  const canvasRef = useRef(null)
  const itemsRef = useRef(items)

  // Update the ref when items change
  useEffect(() => {
    itemsRef.current = items
  }, [items])

  // Get color for a group based on its ID
  const getGroupColor = useCallback((id) => {
    // Use modulo to handle more groups than colors
    const colorIndex = (id - 1) % GROUP_COLORS.length
    return GROUP_COLORS[colorIndex]
  }, [])

  // Handle mouse down on an item
  const handleItemMouseDown = useCallback(
    (e, item) => {
      e.preventDefault() // Prevent default to improve drag behavior
      e.stopPropagation()

      if (isDeleteMode) {
        setItems((prevItems) => prevItems.filter((i) => i.id !== item.id))
        return
      }

      const rect = canvasRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      setDraggingItem(item)
      setDragOffset({
        x: x - item.x,
        y: y - item.y,
      })

      // Store the current groups state before dragging
      previousGroupsRef.current = [...groups]
    },
    [isDeleteMode, groups],
  )

  // Handle mouse move
  const handleMouseMove = useCallback(
    (e) => {
      if (!draggingItem) return

      const rect = canvasRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      // Calculate the new position (free positioning, no grid snapping)
      const newX = x - dragOffset.x
      const newY = y - dragOffset.y

      // Update position immediately without batching
      setItems((prevItems) =>
        prevItems.map((item) => (item.id === draggingItem.id ? { ...item, x: newX, y: newY } : item)),
      )
    },
    [draggingItem, dragOffset],
  )

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    if (draggingItem) {
      // Check if groups have changed
      detectGroupMerges(previousGroupsRef.current, groups)
    }
    setDraggingItem(null)
  }, [draggingItem, groups])

  // Detect group merges and set up animations
  const detectGroupMerges = useCallback((prevGroups, currentGroups) => {
    // Skip if no previous groups
    if (!prevGroups || prevGroups.length === 0) return

    // Find groups that have merged
    const newMergeAnimations = {}

    // For each current group, check if it contains items from multiple previous groups
    currentGroups.forEach((currentGroup) => {
      // Skip single items
      if (currentGroup.isSingle) return

      // Find all previous groups that have items now in this current group
      const sourceGroups = new Set()
      currentGroup.items.forEach((itemId) => {
        prevGroups.forEach((prevGroup) => {
          if (prevGroup.items.includes(itemId)) {
            sourceGroups.add(prevGroup.id)
          }
        })
      })

      // If this group contains items from multiple previous groups, it's a merge
      if (sourceGroups.size > 1) {
        newMergeAnimations[currentGroup.id] = {
          targetGroup: currentGroup,
          sourceGroups: Array.from(sourceGroups)
            .map((id) => prevGroups.find((g) => g.id === id))
            .filter(Boolean),
          startTime: Date.now(),
          duration: 800, // Longer animation duration for more fluid effect
        }
      }
    })

    if (Object.keys(newMergeAnimations).length > 0) {
      setMergeAnimations(newMergeAnimations)

      // Clear animations after they complete
      setTimeout(() => {
        setMergeAnimations({})
      }, 900)
    }
  }, [])

  // Calculate groups based on item proximity
  useEffect(() => {
    // Skip if no items
    if (items.length === 0) return

    // Create a copy of items for processing
    const itemsCopy = [...items]
    const processed = new Set()
    const newGroups = []

    // Process each item to find connected components
    for (let i = 0; i < itemsCopy.length; i++) {
      if (processed.has(i)) continue

      const item = itemsCopy[i]

      // Use breadth-first search to find all connected items
      const queue = [i]
      const groupItems = []
      const itemPositions = []

      while (queue.length > 0) {
        const currentIdx = queue.shift()
        if (processed.has(currentIdx)) continue

        processed.add(currentIdx)
        groupItems.push(currentIdx)
        itemPositions.push({
          x: itemsCopy[currentIdx].x,
          y: itemsCopy[currentIdx].y,
          size: itemsCopy[currentIdx].size,
        })

        const currentItem = itemsCopy[currentIdx]

        // Check proximity to other items
        for (let j = 0; j < itemsCopy.length; j++) {
          if (processed.has(j) || queue.includes(j) || j === currentIdx) continue

          const otherItem = itemsCopy[j]

          // Calculate distance between item centers
          const dx = currentItem.x - otherItem.x
          const dy = currentItem.y - otherItem.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          // If items are close enough, add to the same group
          if (distance <= PROXIMITY_THRESHOLD) {
            queue.push(j)
          }
        }
      }

      // Only create a group if there are items
      if (groupItems.length > 0) {
        // Find bounding box for the group with extra padding for organic shapes
        let minX = Number.POSITIVE_INFINITY
        let minY = Number.POSITIVE_INFINITY
        let maxX = Number.NEGATIVE_INFINITY
        let maxY = Number.NEGATIVE_INFINITY

        groupItems.forEach((idx) => {
          const item = itemsCopy[idx]
          minX = Math.min(minX, item.x - item.size)
          minY = Math.min(minY, item.y - item.size)
          maxX = Math.max(maxX, item.x + item.size)
          maxY = Math.max(maxY, item.y + item.size)
        })

        // Add extra padding for organic shapes
        const padding = 40
        minX -= padding
        minY -= padding
        maxX += padding
        maxY += padding

        // Set all items to this group
        const groupId = groupItems[0] + 1 // Simple ID based on first item
        groupItems.forEach((idx) => {
          itemsCopy[idx].groupId = groupId
        })

        // Add group with bounding box and control points for blob
        newGroups.push({
          id: groupId,
          x: minX,
          y: minY,
          width: maxX - minX,
          height: maxY - minY,
          items: groupItems.map((idx) => itemsCopy[idx].id),
          itemPositions,
          isSingle: groupItems.length === 1,
        })
      }
    }

    setGroups(newGroups)
  }, [items, PROXIMITY_THRESHOLD])

  // Check if a group contains the dragging item
  const isGroupBeingDragged = useCallback(
    (group) => {
      if (!draggingItem) return false
      return group.items.includes(draggingItem.id)
    },
    [draggingItem],
  )

  // Handle mouse enter on a group
  const handleGroupMouseEnter = useCallback((groupId) => {
    setHoveredGroupId(groupId)
  }, [])

  // Handle mouse leave on a group
  const handleGroupMouseLeave = useCallback(() => {
    setHoveredGroupId(null)
  }, [])

  // Get the group ID for an item
  const getItemGroupId = useCallback(
    (itemId) => {
      for (const group of groups) {
        if (group.items.includes(itemId)) {
          return group.id
        }
      }
      return null
    },
    [groups],
  )

  return (
    <div className="flex flex-col h-screen">
      <div className="bg-gray-100 p-4 flex space-x-4">
        <button
          className={`px-4 py-2 rounded ${isDeleteMode ? "bg-red-600 text-white" : "bg-gray-200"}`}
          onClick={() => {
            setIsDeleteMode(!isDeleteMode)
          }}
        >
          {isDeleteMode ? "Cancel Delete" : "Delete Items"}
        </button>
        <p className="text-gray-600 flex items-center">
          {isDeleteMode
            ? "Click on items to delete them"
            : "Drag items freely - they will automatically group with organic, fluid backgrounds"}
        </p>
      </div>

      <div
        ref={canvasRef}
        className="flex-grow relative overflow-auto"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ minHeight: "600px", backgroundColor: "#E9E9E9" }}
      >
        {/* Draw group backgrounds */}
        <div className="absolute top-0 left-0 w-full h-full" style={{ pointerEvents: "none" }}>
          {groups.map((group) => {
            // Check if this group contains the dragging item
            const isDragging = isGroupBeingDragged(group)
            const mergeAnimation = mergeAnimations[group.id]
            const isHovered = hoveredGroupId === group.id
            const shouldFade = hoveredGroupId !== null && !isHovered

            return (
              <div
                key={`group-container-${group.id}`}
                style={{
                  position: "relative",
                  opacity: shouldFade ? 0.5 : 1,
                  transition: "opacity 0.3s ease-in-out",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: `${group.x}px`,
                    top: `${group.y}px`,
                    width: `${group.width}px`,
                    height: `${group.height}px`,
                    zIndex: 2,
                    pointerEvents: "auto",
                    cursor: "default",
                  }}
                  onMouseEnter={() => handleGroupMouseEnter(group.id)}
                  onMouseLeave={handleGroupMouseLeave}
                >
                  {/* Invisible hover area */}
                </div>
                <BlobBackground
                  key={`group-${group.id}`}
                  group={group}
                  isDragging={isDragging}
                  color={getGroupColor(group.id)}
                  mergeAnimation={mergeAnimation}
                />
                <div
                  className="absolute"
                  style={{
                    left: `${group.x}px`,
                    top: `${group.y}px`,
                    width: `${group.width}px`,
                    height: `${group.height}px`,
                    pointerEvents: "none",
                  }}
                >
                  <GroupLabel group={group} items={items} isVisible={isHovered} />
                </div>
              </div>
            )
          })}
        </div>

        {/* Render all items */}
        {items.map((item) => {
          const itemGroupId = getItemGroupId(item.id)
          const isHovered = hoveredGroupId === itemGroupId
          const shouldFade = hoveredGroupId !== null && !isHovered

          return (
            <CircularItem
              key={item.id}
              item={item}
              isBeingDragged={draggingItem?.id === item.id}
              isDeleteMode={isDeleteMode}
              onMouseDown={handleItemMouseDown}
              isFaded={shouldFade}
              groupId={itemGroupId}
              onMouseEnter={() => handleGroupMouseEnter(itemGroupId)}
              onMouseLeave={handleGroupMouseLeave}
            />
          )
        })}
      </div>

      <div className="bg-gray-100 p-2 text-sm text-gray-600">
        <p>
          Drag items freely around the canvas. Items will automatically group with organic, fluid backgrounds. Hover
          over a group or any item within it to see its label.
        </p>
      </div>
    </div>
  )
}
