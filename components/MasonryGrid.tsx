'use client'

import { useEffect, useRef, useState } from 'react'
import PinCard from './PinCard'

interface Pin {
  id: string
  title: string
  description?: string
  imageUrl: string
  user: {
    id: string
    name: string
    image?: string
  }
  _count: {
    likes: number
    comments: number
  }
}

interface MasonryGridProps {
  pins: Pin[]
}

export default function MasonryGrid({ pins }: MasonryGridProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [columns, setColumns] = useState(4)

  useEffect(() => {
    const updateColumns = () => {
      if (window.innerWidth < 640) {
        setColumns(2)
      } else if (window.innerWidth < 1024) {
        setColumns(3)
      } else if (window.innerWidth < 1536) {
        setColumns(4)
      } else {
        setColumns(5)
      }
    }

    updateColumns()
    window.addEventListener('resize', updateColumns)
    return () => window.removeEventListener('resize', updateColumns)
  }, [])

  // Distribuer les pins dans les colonnes
  const columnArrays: Pin[][] = Array.from({ length: columns }, () => [])
  pins.forEach((pin, index) => {
    columnArrays[index % columns].push(pin)
  })

  return (
    <div ref={containerRef} className="masonry-grid">
      {columnArrays.map((columnPins, columnIndex) => (
        <div key={columnIndex} className="masonry-column" style={{ flex: 1 }}>
          {columnPins.map((pin) => (
            <div key={pin.id} className="masonry-item">
              <PinCard pin={pin} />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
