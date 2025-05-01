import React, { useState } from 'react';
import Image from 'next/image';
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

  return (
    <>
      <div
        className={`absolute cursor-pointer ${isSelected ? 'z-10' : ''}`}
        style={{
          left: position.x,
          top: position.y,
          transform: 'translate(-50%, -50%)'
        }}
        draggable
        onDragStart={(e) => {
          e.stopPropagation();
          onDragStart();
        }}
        onDragEnd={(e) => {
          e.stopPropagation();
          onDragEnd();
        }}
        onDrag={(e) => onDrag(e, id)}
      >
        <div 
          className={`w-24 h-24 rounded-full overflow-hidden border-4 transition-all ${
            isSelected ? 'border-blue-500' : isGrouped ? 'border-green-500' : 'border-transparent'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            console.log('Opening modal for:', name);
            setShowModal(true);
          }}
        >
          <div className="relative w-full h-full">
            <Image
              src={imageUrl}
              alt={name}
              fill
              style={{ objectFit: 'cover' }}
              draggable={false}
            />
          </div>
        </div>
      </div>

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