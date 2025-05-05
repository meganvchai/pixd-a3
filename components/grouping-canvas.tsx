"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import CircularItem from "./circular-item"
import BlobBackground from "./blob-background"
import GroupLabel from "./group-label"

interface Item {
  id: number
  type: string
  groupId: number
  x: number
  y: number
  size: number
}

interface Group {
  id: string
  items: number[]
  isSingle: boolean
  x: number
  y: number
  width: number
  height: number
  itemPositions: Array<{ x: number; y: number; size: number }>
}

interface MergeAnimation {
  targetGroup: Group
  sourceGroups: Group[]
  startTime: number
  duration: number
}

export default function GroupingCanvas() {
  // Item settings
  const ITEM_SIZE = 100
  const PROXIMITY_THRESHOLD = 100
  const CANVAS_WIDTH = 1200
  const CANVAS_HEIGHT = 800

  // Define specific colors for group backgrounds
  const GROUP_COLORS = [
    "#FDCDD9", // Pink
    "#F3AB88", // Orange
    "#FEF8CE", // Yellow
    "#DBE7AB", // Green
    "#93D4FF", // Blue
    "#C3C1E0", // Purple
  ]

  // Helper function to generate random position within canvas bounds
  const getRandomPosition = () => {
    const padding = ITEM_SIZE * 2 // Ensure items don't spawn too close to edges
    return {
      x: padding + Math.random() * (CANVAS_WIDTH - padding * 2),
      y: padding + Math.random() * (CANVAS_HEIGHT - padding * 2)
    }
  }

  // Define initial items with random positioning
  const getInitialItems = (): Item[] => {
    const items = [
      { id: 1, type: "carbone", groupId: 1, size: ITEM_SIZE },
      { id: 2, type: "bigsur", groupId: 2, size: ITEM_SIZE },
      { id: 3, type: "calpig", groupId: 3, size: ITEM_SIZE },
      { id: 4, type: "daytrip", groupId: 4, size: ITEM_SIZE },
      { id: 5, type: "dishoom", groupId: 5, size: ITEM_SIZE },
      { id: 6, type: "gudetama", groupId: 6, size: ITEM_SIZE },
      { id: 7, type: "fournee", groupId: 7, size: ITEM_SIZE },
      { id: 8, type: "berkeley", groupId: 8, size: ITEM_SIZE },
      { id: 9, type: "centralpark", groupId: 9, size: ITEM_SIZE },
      { id: 10, type: "cat", groupId: 10, size: ITEM_SIZE },
      { id: 11, type: "matcha", groupId: 11, size: ITEM_SIZE },
      { id: 12, type: "moma", groupId: 12, size: ITEM_SIZE },
      { id: 13, type: "jr", groupId: 13, size: ITEM_SIZE },
      { id: 14, type: "nyMetro", groupId: 14, size: ITEM_SIZE },
      { id: 15, type: "tenryuji", groupId: 15, size: ITEM_SIZE },
      { id: 16, type: "volleyball", groupId: 16, size: ITEM_SIZE },
      { id: 17, type: "pickle", groupId: 17, size: ITEM_SIZE },
      { id: 18, type: "recycle", groupId: 18, size: ITEM_SIZE },
      { id: 19, type: "whiteWhale", groupId: 19, size: ITEM_SIZE },
      { id: 20, type: "pittsburgh", groupId: 20, size: ITEM_SIZE },
      { id: 21, type: "helloKitty", groupId: 21, size: ITEM_SIZE },
      { id: 22, type: "miffy", groupId: 22, size: ITEM_SIZE },
      { id: 23, type: "olive", groupId: 23, size: ITEM_SIZE }
    ]

    return items.map(item => ({
      ...item,
      ...getRandomPosition()
    }))
  }

  const [items, setItems] = useState<Item[]>([])
  const [isClient, setIsClient] = useState(false)

  // Initialize items on client-side only
  useEffect(() => {
    setIsClient(true)
    const savedItems = localStorage.getItem('canvasItems')
    if (savedItems) {
      setItems(JSON.parse(savedItems))
    } else {
      const newItems = getInitialItems()
      localStorage.setItem('canvasItems', JSON.stringify(newItems))
      setItems(newItems)
    }
  }, [])

  const [draggingItem, setDraggingItem] = useState<Item | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  
  const [groups, setGroups] = useState<Group[]>([])
  const [mergeAnimations, setMergeAnimations] = useState<Record<string, MergeAnimation>>({})
  const [hoveredGroupId, setHoveredGroupId] = useState<string | null>(null)

  // Store previous groups in a ref to avoid triggering re-renders
  const previousGroupsRef = useRef<Group[]>([])
  const canvasRef = useRef<HTMLDivElement>(null)
  const itemsRef = useRef<Item[]>(items)

  // Save to localStorage whenever items or groups change
  useEffect(() => {
    if (isClient) {
      localStorage.setItem('canvasItems', JSON.stringify(items))
    }
  }, [items, isClient])

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('canvasGroups', JSON.stringify(groups))
    }
  }, [groups, isClient])

  // Update the ref when items change
  useEffect(() => {
    itemsRef.current = items
  }, [items])

  // Get color for a group based on its ID
  const getGroupColor = useCallback((id: string): string => {
    const colorIndex = (parseInt(id) - 1) % GROUP_COLORS.length
    return GROUP_COLORS[colorIndex]
  }, [])

  // Handle mouse down on an item
  const handleItemMouseDown = useCallback(
    (e: React.MouseEvent<Element, MouseEvent>, item: Item) => {
      e.preventDefault()
      e.stopPropagation()

      if (!canvasRef.current) return

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
    [groups],
  )

  // Handle mouse move
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!draggingItem || !canvasRef.current) return

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
  const detectGroupMerges = useCallback((prevGroups: Group[], currentGroups: Group[]) => {
    // Skip if no previous groups
    if (!prevGroups || prevGroups.length === 0) return

    // Find groups that have merged
    const newMergeAnimations: Record<string, MergeAnimation> = {}

    // For each current group, check if it contains items from multiple previous groups
    currentGroups.forEach((currentGroup) => {
      // Skip single items
      if (currentGroup.isSingle) return

      // Find all previous groups that have items now in this current group
      const sourceGroups = new Set<string>()
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
            .map((id) => prevGroups.find((g) => g.id === id.toString()))
            .filter((g): g is Group => g !== undefined),
          startTime: Date.now(),
          duration: 200, // Faster, less noticeable animation
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
    const processed = new Set<number>()
    const newGroups: Group[] = []

    // Process each item to find connected components
    for (let i = 0; i < itemsCopy.length; i++) {
      if (processed.has(i)) continue

      const item = itemsCopy[i]
      if (!item) continue

      // Use breadth-first search to find all connected items
      const queue = [i]
      const groupItems: number[] = []
      const itemPositions: Array<{ x: number; y: number; size: number }> = []

      while (queue.length > 0) {
        const currentIdx = queue.shift()
        if (currentIdx === undefined || processed.has(currentIdx)) continue

        processed.add(currentIdx)
        groupItems.push(currentIdx)
        const currentItem = itemsCopy[currentIdx]
        if (currentItem) {
          itemPositions.push({
            x: currentItem.x,
            y: currentItem.y,
            size: currentItem.size,
          })
        }

        // Check proximity to other items
        for (let j = 0; j < itemsCopy.length; j++) {
          if (processed.has(j) || queue.includes(j) || j === currentIdx) continue

          const otherItem = itemsCopy[j]
          if (!otherItem || !currentItem) continue

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
          if (item) {
            minX = Math.min(minX, item.x - item.size)
            minY = Math.min(minY, item.y - item.size)
            maxX = Math.max(maxX, item.x + item.size)
            maxY = Math.max(maxY, item.y + item.size)
          }
        })

        // Add extra padding for organic shapes
        const padding = 40
        minX -= padding
        minY -= padding
        maxX += padding
        maxY += padding

        // Set all items to this group
        const groupId = (groupItems[0] ?? 0).toString() // Simple ID based on first item
        groupItems.forEach((idx) => {
          const item = itemsCopy[idx]
          if (item) {
            item.groupId = parseInt(groupId)
          }
        })

        // Add group with bounding box and control points for blob
        newGroups.push({
          id: groupId,
          x: minX,
          y: minY,
          width: maxX - minX,
          height: maxY - minY,
          items: groupItems.map((idx) => itemsCopy[idx]?.id ?? 0).filter(id => id !== 0),
          itemPositions,
          isSingle: groupItems.length === 1,
        })
      }
    }

    setGroups(newGroups)
  }, [items, PROXIMITY_THRESHOLD])

  // Check if a group contains the dragging item
  const isGroupBeingDragged = useCallback(
    (group: Group) => {
      if (!draggingItem) return false
      return group.items.includes(draggingItem.id)
    },
    [draggingItem],
  )

  // Handle mouse enter on a group
  const handleGroupMouseEnter = useCallback((groupId: string) => {
    setHoveredGroupId(groupId)
  }, [])

  // Handle mouse leave on a group
  const handleGroupMouseLeave = useCallback(() => {
    setHoveredGroupId(null)
  }, [])

  // Get the group ID for an item
  const getItemGroupId = useCallback(
    (itemId: number) => {
      for (const group of groups) {
        if (group.items.includes(itemId)) {
          return group.id
        }
      }
      return null
    },
    [groups],
  )

  if (!isClient) {
    return <div className="flex-grow relative overflow-auto" style={{ minHeight: "600px", backgroundColor: "#E9E9E9" }} />
  }

  return (
    <div className="flex flex-col h-screen">
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

            return (
              <div
                key={`group-container-${group.id}`}
                style={{
                  position: "relative",
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

          return (
            <CircularItem
              key={item.id}
              item={item}
              isBeingDragged={draggingItem?.id === item.id}
              isDeleteMode={false}
              onMouseDown={handleItemMouseDown}
              groupId={itemGroupId?.toString() ?? ""}
              onMouseEnter={() => itemGroupId && handleGroupMouseEnter(itemGroupId)}
              onMouseLeave={handleGroupMouseLeave}
            />
          )
        })}
      </div>
    </div>
  )
}
