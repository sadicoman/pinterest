'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, MessageCircle, Share2 } from 'lucide-react'

interface PinCardProps {
  pin: {
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
}

export default function PinCard({ pin }: PinCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(pin._count.likes)

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      const res = await fetch(`/api/pins/${pin.id}/like`, {
        method: 'POST',
      })

      if (res.ok) {
        const data = await res.json()
        setLiked(data.liked)
        setLikesCount(prev => data.liked ? prev + 1 : prev - 1)
      }
    } catch (error) {
      console.error('Erreur like:', error)
    }
  }

  return (
    <Link href={`/pin/${pin.id}`}>
      <div
        className="relative group cursor-pointer rounded-2xl overflow-hidden bg-gray-100"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image */}
        <div className="relative w-full">
          <Image
            src={pin.imageUrl}
            alt={pin.title}
            width={300}
            height={400}
            className="w-full h-auto object-cover"
            unoptimized
          />

          {/* Overlay au survol */}
          {isHovered && (
            <div className="absolute inset-0 bg-black bg-opacity-40 transition-opacity">
              <div className="absolute top-3 right-3">
                <button className="btn-primary px-4 py-2 text-sm">
                  Enregistrer
                </button>
              </div>

              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                <div className="flex gap-2">
                  <button
                    onClick={handleLike}
                    className={`p-2 rounded-full bg-white hover:bg-gray-100 transition-colors ${
                      liked ? 'text-pinterest-primary' : 'text-pinterest-black'
                    }`}
                  >
                    <Heart className="w-5 h-5" fill={liked ? 'currentColor' : 'none'} />
                  </button>
                  <button className="p-2 rounded-full bg-white hover:bg-gray-100 transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center gap-2 text-white text-sm">
                  <Heart className="w-4 h-4" />
                  <span>{likesCount}</span>
                  <MessageCircle className="w-4 h-4 ml-2" />
                  <span>{pin._count.comments}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Informations */}
        <div className="p-3">
          <h3 className="font-semibold text-sm line-clamp-2 mb-2">
            {pin.title}
          </h3>
          {pin.description && (
            <p className="text-xs text-gray-600 line-clamp-2 mb-2">
              {pin.description}
            </p>
          )}
          <div className="flex items-center gap-2">
            {pin.user.image ? (
              <Image
                src={pin.user.image}
                alt={pin.user.name || 'User'}
                width={24}
                height={24}
                className="rounded-full"
              />
            ) : (
              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-xs font-semibold">
                  {pin.user.name?.[0]?.toUpperCase()}
                </span>
              </div>
            )}
            <span className="text-xs text-gray-600">{pin.user.name}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
