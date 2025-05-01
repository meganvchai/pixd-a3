"use client"

import React, { useState, useRef } from 'react'

export default function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalPos, setModalPos] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const dragOffset = useRef({ x: 0, y: 0 })

  // Center modal on open
  const centerModal = () => {
    if (typeof window !== 'undefined') {
      const vw = window.innerWidth
      const vh = window.innerHeight
      setModalPos({ x: (vw - 649) / 2, y: (vh - 411) / 2 })
    }
  }

  // Open modal and center it
  const openModal = () => {
    centerModal()
    setIsModalOpen(true)
  }

  // Drag handlers
  const onMouseDown = (e: React.MouseEvent) => {
    setDragging(true)
    dragOffset.current = {
      x: e.clientX - modalPos.x,
      y: e.clientY - modalPos.y,
    }
    document.body.style.userSelect = 'none'
  }
  const onMouseMove = (e: MouseEvent) => {
    if (dragging) {
      const modalWidth = 649;
      // Estimate modal height from the DOM if possible, fallback to 0
      let modalHeight = 0;
      const modalEl = document.getElementById('draggable-modal');
      if (modalEl) {
        modalHeight = modalEl.offsetHeight;
      }
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const maxX = Math.max(0, vw - modalWidth);
      const maxY = Math.max(0, vh - modalHeight);
      let newX = e.clientX - dragOffset.current.x;
      let newY = e.clientY - dragOffset.current.y;
      newX = Math.max(0, Math.min(newX, maxX));
      newY = Math.max(0, Math.min(newY, maxY));
      setModalPos({
        x: newX,
        y: newY,
      });
    }
  }
  const onMouseUp = () => {
    setDragging(false)
    document.body.style.userSelect = ''
  }

  // Attach/detach mousemove/up listeners
  React.useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', onMouseMove)
      window.addEventListener('mouseup', onMouseUp)
    } else {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [dragging])

  return (
    <>
      <div style={{
        position: 'fixed',
        top: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
      }}>
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          height: '40px',
          padding: '4px 8px',
          background: 'rgba(255,255,255,0.6)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(16px)',
        }}>
          <span style={{
            color: '#FFC2EC',
            fontSize: '24px',
          }}>
            ❋
          </span>
          <span style={{
            fontFamily: 'HAL Timezone Unlicensed',
            fontWeight: 500,
            fontSize: '20px',
            color: '#111',
          }}>
            Megan's Archive
          </span>
        </nav>
        <button
          onClick={openModal}
          style={{
            marginLeft: '8px',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: '#FFC2EC',
            border: 'none',
            color: '#111',
            fontFamily: 'GT America',
            fontWeight: 'bold',
            fontSize: '16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          ?
        </button>
      </div>

      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 2000,
        }}>
          <div id="draggable-modal" style={{
            position: 'absolute',
            left: modalPos.x,
            top: modalPos.y,
            width: 650,
            display: 'flex',
            alignItems: 'stretch',
            justifyContent: 'stretch',
            cursor: dragging ? 'grabbing' : 'grab',
            zIndex: 10,
          }}>
            {/* Blurred pink background layer */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: '#FFAEE9',
                filter: 'blur(16.2px)',
                borderRadius: 12,
                zIndex: 0,
              }}
            />
            {/* Modal content layer */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                borderRadius: 12,
                padding: 48,
                boxSizing: 'border-box',
                color: '#000',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                zIndex: 1,
                background: 'transparent',
                userSelect: dragging ? 'none' : 'auto',
                pointerEvents: dragging ? 'none' : 'auto',
              }}
              onMouseDown={onMouseDown}
            >
              <button
                onClick={e => { e.stopPropagation(); setIsModalOpen(false); }}
                onMouseDown={e => e.stopPropagation()}
                style={{
                  position: 'absolute',
                  top: 32,
                  right: 32,
                  width: 40,
                  height: 40,
                  fontSize: 24,
                  cursor: 'pointer',
                  background: 'none',
                  border: 'none',
                  color: '#333',
                  lineHeight: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                aria-label="Close modal"
              >
                ×
              </button>
              <h1
                style={{
                  fontFamily: 'HAL Timezone Unlicensed, Times New Roman, serif',
                  fontSize: 24,
                  margin: 0,
                  marginBottom: 32,
                }}
              >
                Welcome to my corner of the internet :)
              </h1>
              <p
                style={{
                  fontFamily: 'GT America, Arial, sans-serif',
                  fontSize: 16,
                  lineHeight: 1.5,
                  marginBottom: 12,
                }}
              >
                Feel free to explore and discover objects that pique your curiosity. Objects are a collection of my personal trinkets, paper mementos or travel memorabilia.
              </p>
              <p
                style={{
                  fontFamily: 'GT America, Arial, sans-serif',
                  fontSize: 16,
                  lineHeight: 1.5,
                  marginBottom: 20,
                }}
              >
                This website is aims to explore alternative representations of information design that diverges from web design conventions, while using the unique affordances of digital experiences. I encourage visitors to wander throughout the experience as a delightful activity, instead of focusing on the use of the web as a tool for efficiency and utility.
              </p>
              <div
                style={{
                  fontFamily: 'GT America, Arial, sans-serif',
                  fontSize: 12,
                  marginTop: 0,
                }}
              >
                Website created by{' '}
                <a
                  href="#"
                  style={{
                    color: 'inherit',
                    textDecoration: 'none',
                    borderBottom: '1px solid #000',
                  }}
                >
                  Megan Chai
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 