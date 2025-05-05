import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import ObjectModal from './object-modal';

interface CircularItemProps {
  id: string;
  imageUrl: string;
  name: string;
  city: string;
  year: string;
  type: string;
  position: { x: number; y: number };
  onDragStart: () => void;
  onDragEnd: () => void;
  onDrag: (e: any, id: string) => void;
  isSelected: boolean;
  isGrouped: boolean;
}

export default function CircularItem({
  id,
  imageUrl,
  name,
  city,
  year,
  type,
  position,
  onDragStart,
  onDragEnd,
  onDrag,
  isSelected,
  isGrouped
}: CircularItemProps) {
  const [showModal, setShowModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartTime = useRef(0);
  const draggedDistance = useRef(0);
  const startPosition = useRef({ x: 0, y: 0 });
  const nodeRef = useRef<HTMLDivElement>(null);
  const clickTimeout = useRef<NodeJS.Timeout | null>(null);

  // Debug state changes
  useEffect(() => {
    console.log('Modal state changed:', showModal);
  }, [showModal]);

  useEffect(() => {
    console.log('Drag state changed:', isDragging);
  }, [isDragging]);

  const handleStart = (e: DraggableEvent, data: DraggableData) => {
    console.log('Drag start event triggered');
    e.preventDefault();
    e.stopPropagation();
    
    setIsDragging(false);
    dragStartTime.current = Date.now();
    draggedDistance.current = 0;
    startPosition.current = { x: data.x, y: data.y };
    onDragStart();
  };

  const handleDrag = (e: DraggableEvent, data: DraggableData) => {
    e.preventDefault();
    e.stopPropagation();
    
    const dx = data.x - startPosition.current.x;
    const dy = data.y - startPosition.current.y;
    draggedDistance.current = Math.sqrt(dx * dx + dy * dy);
    
    if (draggedDistance.current > 5) {
      setIsDragging(true);
      console.log('Dragging detected, distance:', draggedDistance.current);
    }
    
    onDrag(e, id);
  };

  const handleStop = (e: DraggableEvent, data: DraggableData) => {
    console.log('Drag stop event triggered');
    e.preventDefault();
    e.stopPropagation();
    
    const dragDuration = Date.now() - dragStartTime.current;
    console.log('Drag ended:', {
      distance: draggedDistance.current,
      duration: dragDuration,
      isDragging
    });
    
    onDragEnd();
  };

  const handleImageClick = (e: React.MouseEvent) => {
    console.log('Image clicked!');
    e.preventDefault();
    e.stopPropagation();
    setShowModal(true);
  };

  return (
    <>
      <Draggable
        nodeRef={nodeRef as React.RefObject<HTMLElement>}
        position={position}
        onStart={handleStart}
        onDrag={handleDrag}
        onStop={handleStop}
        bounds="parent"
      >
        <div 
          ref={nodeRef}
          className={`absolute cursor-grab active:cursor-grabbing ${isSelected ? 'z-10' : ''}`}
          style={{ 
            touchAction: 'none', 
            userSelect: 'none',
            pointerEvents: 'auto'
          }}
        >
          <div 
            className={`w-24 h-24 rounded-full overflow-hidden border-4 transition-all ${
              isSelected ? 'border-blue-500' : isGrouped ? 'border-green-500' : 'border-transparent'
            }`}
            onClick={handleImageClick}
            style={{ cursor: 'pointer' }}
          >
            <div 
              className="relative w-full h-full"
              onClick={handleImageClick}
            >
              <Image
                src={imageUrl}
                alt={name}
                fill
                style={{ objectFit: 'cover' }}
                draggable={false}
                priority
                onClick={handleImageClick}
              />
            </div>
          </div>
        </div>
      </Draggable>

      <ObjectModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        object={{
          name,
          city,
          year,
          type,
          imageUrl
        }}
      />
    </>
  );
} 