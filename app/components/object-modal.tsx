import React from 'react';
import Image from 'next/image';

interface ObjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  object: {
    name: string;
    city: string;
    year: string;
    type: string;
    imageUrl: string;
  };
}

export default function ObjectModal({ isOpen, onClose, object }: ObjectModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Modal Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div 
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white z-50 flex p-16 gap-10"
        style={{ width: '1026px', height: '500px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left side - Image */}
        <div className="flex-1 h-full flex items-center justify-center">
          <div className="relative w-full h-full">
            <Image
              src={object.imageUrl}
              alt={object.name}
              fill
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>
        </div>

        {/* Right side - Details */}
        <div className="flex-1">
          <h1 className="text-[32px] font-normal mb-12">{object.name}</h1>
          
          <div className="space-y-4">
            <div>
              <div className="uppercase text-xs tracking-wider text-[#5C5C5C] mb-1">CITY OF ORIGIN</div>
              <div>{object.city}</div>
            </div>

            <div>
              <div className="uppercase text-xs tracking-wider text-[#5C5C5C] mb-1">YEAR</div>
              <div>{object.year}</div>
            </div>

            <div>
              <div className="uppercase text-xs tracking-wider text-[#5C5C5C] mb-1">OBJECT TYPE</div>
              <div>{object.type}</div>
            </div>
          </div>
        </div>

        {/* Close button */}
        <button
          className="absolute top-6 right-6 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ✕
        </button>
      </div>
    </>
  );
} 