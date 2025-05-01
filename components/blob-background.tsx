"use client"

// Declare module for simplex-noise
declare module 'simplex-noise' {
  export function createNoise2D(): (x: number, y: number) => number;
}

import { useEffect, useState, useRef, memo } from "react"
import { createNoise2D } from "simplex-noise"

interface GroupItem {
  x: number
  y: number
  size: number
}

interface Group {
  x: number
  y: number
  width: number
  height: number
  isSingle?: boolean
  itemPositions: GroupItem[]
}

interface MergeAnimation {
  startTime: number
  duration: number
}

interface Point {
  x: number
  y: number
  baseX?: number
  baseY?: number
  angle?: number
  radius?: number
}

interface BlobBackgroundProps {
  group: Group
  isDragging: boolean
  color: string
  mergeAnimation: MergeAnimation | null
}

// Use memo to prevent unnecessary re-renders
const BlobBackground = memo(function BlobBackground({ group, isDragging, color, mergeAnimation }: BlobBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [animationProgress, setAnimationProgress] = useState(0)
  const animationFrameRef = useRef<number | null>(null)
  // Create noise function only once
  const noiseRef = useRef<((x: number, y: number) => number) | null>(null)
  if (noiseRef.current === null) {
    noiseRef.current = createNoise2D()
  }
  const timeRef = useRef<number>(0)
  const animationRef = useRef<number | null>(null)
  const lastDrawTimeRef = useRef<number>(0)

  // Animate the blob continuously for fluid movement with throttling
  useEffect(() => {
    const animate = () => {
      const now = Date.now()
      // Throttle updates to avoid excessive redraws
      if (now - lastDrawTimeRef.current > 16) {
        // ~60fps
        timeRef.current += 0.002 // Slower time increment for smoother animation
        if (canvasRef.current) {
          const canvas = canvasRef.current
          const ctx = canvas.getContext("2d")
          if (ctx) {
            drawBlob(ctx, group, color, animationProgress)
          }
          lastDrawTimeRef.current = now
        }
      }
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [group, color, animationProgress])

  // Handle merge animation
  useEffect(() => {
    if (!mergeAnimation) {
      setAnimationProgress(0)
      return
    }

    const startTime = mergeAnimation.startTime
    const duration = mergeAnimation.duration

    const updateAnimation = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      setAnimationProgress(progress)

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(updateAnimation)
      }
    }

    animationFrameRef.current = requestAnimationFrame(updateAnimation)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [mergeAnimation])

  // Draw a blob shape that encompasses all items in the group
  const drawBlob = (
    ctx: CanvasRenderingContext2D,
    group: Group,
    color: string,
    animationProgress: number
  ) => {
    const { width, height, itemPositions } = group

    // If there are no items, don't draw anything
    if (!itemPositions || itemPositions.length === 0) return

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // For single items, draw a pulsating circle
    if (group.isSingle) {
      const item = itemPositions[0]
      const centerX = item.x - group.x
      const centerY = item.y - group.y
      const baseRadius = item.size * 0.7 // Slightly smaller radius for single items

      // Add subtle pulsation and wobble
      const time = timeRef.current
      const pulseFactor = 1 + Math.sin(time * 2) * 0.03 // Reduced pulsation
      const wobbleAmount = 1.5 // Reduced wobble amount for smoother edges

      ctx.beginPath()

      // Draw a wobbly circle with more points for smoother edges
      for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 64) { // Doubled number of points
        const noise = noiseRef.current?.(Math.cos(angle) + time, Math.sin(angle) + time) ?? 0
        const radius = baseRadius * pulseFactor + noise * wobbleAmount
        const x = centerX + Math.cos(angle) * radius
        const y = centerY + Math.sin(angle) * radius

        if (angle === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }

      ctx.closePath()
      ctx.fillStyle = color
      ctx.shadowColor = "rgba(0, 0, 0, 0.1)" // Lighter shadow
      ctx.shadowBlur = 8
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 2
      ctx.fill()
      return
    }

    // For groups, create a more organic blob shape
    let controlPoints: Point[] = []
    const centerX = width / 2
    const centerY = height / 2

    // Generate base control points around each item
    itemPositions.forEach((item) => {
      const x = item.x - group.x
      const y = item.y - group.y
      const radius = item.size * 0.8 // Slightly smaller radius for smoother group shapes

      // Add more control points for smoother curves
      for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 48) { // Doubled number of points
        // Increased number of points
        controlPoints.push({
          x: x + Math.cos(angle) * radius,
          y: y + Math.sin(angle) * radius,
          baseX: x,
          baseY: y,
          angle,
          radius,
        })
      }
    })

    // Find the convex hull of the control points to create a smoother outline
    controlPoints = getConvexHull(controlPoints)

    // If we have a merge animation, create a morphing effect
    if (mergeAnimation && animationProgress > 0) {
      // Draw a morphing blob that grows from the items to encompass the group
      const expandFactor = 0.5 + animationProgress * 0.5

      // Modify control points based on animation progress
      controlPoints = controlPoints.map((point) => {
        const dx = point.x - centerX
        const dy = point.y - centerY
        const distance = Math.sqrt(dx * dx + dy * dy)
        const angle = Math.atan2(dy, dx)

        const expandedDistance = distance * (1 + (expandFactor - 1) * animationProgress)
        return {
          ...point,
          x: centerX + Math.cos(angle) * expandedDistance,
          y: centerY + Math.sin(angle) * expandedDistance,
        }
      })
    }

    // Draw the blob with organic movement
    ctx.beginPath()

    if (controlPoints.length > 0) {
      // Add noise to control points for organic movement
      const time = timeRef.current
      const noisyPoints = controlPoints.map((point: Point) => {
        const noise = noiseRef.current?.(point.x / 100 + time, point.y / 100 + time) ?? 0
        const wobbleAmount = 2 // Reduced wobble amount for smoother edges
        return {
          ...point,
          x: point.x + noise * wobbleAmount,
          y: point.y + noise * wobbleAmount,
        }
      })

      // Start at the first point
      ctx.moveTo(noisyPoints[0].x, noisyPoints[0].y)

      // Draw smooth curves between points using bezier curves for smoother edges
      for (let i = 0; i < noisyPoints.length; i++) {
        const current = noisyPoints[i]
        const next = noisyPoints[(i + 1) % noisyPoints.length]

        // Calculate control points for cubic bezier
        // Using more precise control point calculation for smoother curves
        const dx = next.x - current.x
        const dy = next.y - current.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        // Adjust control point distance based on the distance between points
        const controlPointDistance = Math.min(distance * 0.4, 30)

        // Calculate perpendicular vector for natural curve
        const perpX = -dy / distance
        const perpY = dx / distance

        // Add slight randomization to control points for more natural curves
        const randomFactor = 0.2
        const random1 = 1 - randomFactor / 2 + Math.random() * randomFactor
        const random2 = 1 - randomFactor / 2 + Math.random() * randomFactor

        const cp1x = current.x + dx * 0.3 + perpX * controlPointDistance * random1
        const cp1y = current.y + dy * 0.3 + perpY * controlPointDistance * random1
        const cp2x = current.x + dx * 0.7 - perpX * controlPointDistance * random2
        const cp2y = current.y + dy * 0.7 - perpY * controlPointDistance * random2

        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, next.x, next.y)
      }
    }

    ctx.closePath()

    // Fill with gradient for more fluid appearance
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(width, height) / 2)

    // Parse the HSL color to get components
    const hslMatch = color.match(/hsl$$(\d+),\s*(\d+)%,\s*(\d+)%$$/)
    if (hslMatch) {
      const h = Number.parseInt(hslMatch[1])
      const s = Number.parseInt(hslMatch[2])
      const l = Number.parseInt(hslMatch[3])

      // Create slightly different colors for gradient
      const innerColor = `hsl(${h}, ${s}%, ${l + 5}%)`
      const outerColor = `hsl(${h}, ${s}%, ${l - 5}%)`

      gradient.addColorStop(0, innerColor)
      gradient.addColorStop(1, outerColor)
    } else {
      gradient.addColorStop(0, color)
      gradient.addColorStop(1, color)
    }

    ctx.fillStyle = gradient
    ctx.shadowColor = "rgba(0, 0, 0, 0.1)" // Lighter shadow
    ctx.shadowBlur = 10
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 2
    ctx.fill()
  }

  // Function to get the convex hull of points (Graham scan algorithm)
  const getConvexHull = (points: Point[]): Point[] => {
    if (points.length <= 3) return points

    // Find the point with the lowest y-coordinate (and leftmost if tied)
    let lowestPoint = points[0]
    for (let i = 1; i < points.length; i++) {
      if (points[i].y < lowestPoint.y || (points[i].y === lowestPoint.y && points[i].x < lowestPoint.x)) {
        lowestPoint = points[i]
      }
    }

    // Sort points by polar angle with respect to the lowest point
    const sortedPoints = [...points].sort((a, b) => {
      const angleA = Math.atan2(a.y - lowestPoint.y, a.x - lowestPoint.x)
      const angleB = Math.atan2(b.y - lowestPoint.y, b.x - lowestPoint.x)

      if (angleA === angleB) {
        // If angles are the same, sort by distance from lowest point
        const distA = Math.sqrt(Math.pow(a.x - lowestPoint.x, 2) + Math.pow(a.y - lowestPoint.y, 2))
        const distB = Math.sqrt(Math.pow(b.x - lowestPoint.x, 2) + Math.pow(b.y - lowestPoint.y, 2))
        return distA - distB
      }

      return angleA - angleB
    })

    // Build the convex hull
    const hull = [sortedPoints[0], sortedPoints[1]]

    for (let i = 2; i < sortedPoints.length; i++) {
      while (hull.length > 1 && !isLeftTurn(hull[hull.length - 2], hull[hull.length - 1], sortedPoints[i])) {
        hull.pop()
      }
      hull.push(sortedPoints[i])
    }

    return hull
  }

  // Helper function for convex hull algorithm
  const isLeftTurn = (p1: Point, p2: Point, p3: Point): boolean => {
    return (p2.x - p1.x) * (p3.y - p1.y) - (p2.y - p1.y) * (p3.x - p1.x) > 0
  }

  return (
    <div
      style={{
        position: "absolute",
        left: `${group.x}px`,
        top: `${group.y}px`,
        width: `${group.width}px`,
        height: `${group.height}px`,
        transition: isDragging ? "none" : "all 0.3s ease-out",
        zIndex: 1,
      }}
    >
      <canvas
        ref={canvasRef}
        width={group.width}
        height={group.height}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  )
})

export default BlobBackground
