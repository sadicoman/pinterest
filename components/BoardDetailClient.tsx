'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, X, Lock, Pencil, Trash2 } from 'lucide-react'
import Link from 'next/link'
import MasonryGrid from './MasonryGrid'
import Image from 'next/image'

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

interface Board {
  id: string
  name: string
  description?: string
  isPrivate: boolean
  user: {
    id: string
    name: string
    image?: string
  }
}

interface BoardDetailClientProps {
  board: Board
  boardPins: Pin[]
  availablePins: Pin[]
}

export default function BoardDetailClient({
  board,
  boardPins: initialBoardPins,
  availablePins: initialAvailablePins,
}: BoardDetailClientProps) {
  const router = useRouter()
  const [boardPins, setBoardPins] = useState(initialBoardPins)
  const [availablePins, setAvailablePins] = useState(initialAvailablePins)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleAddPin = async (pinId: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/boards/${board.id}/pins`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pinId }),
      })

      if (!res.ok) {
        throw new Error('Erreur lors de l\'ajout du pin')
      }

      // Déplacer le pin de available vers board
      const addedPin = availablePins.find((p) => p.id === pinId)
      if (addedPin) {
        setBoardPins([addedPin, ...boardPins])
        setAvailablePins(availablePins.filter((p) => p.id !== pinId))
      }

      router.refresh()
    } catch (error) {
      console.error(error)
      alert('Erreur lors de l\'ajout du pin')
    } finally {
      setLoading(false)
    }
  }

  const handleRemovePin = async (pinId: string) => {
    if (!confirm('Retirer ce pin du tableau ?')) return

    setLoading(true)
    try {
      const res = await fetch(`/api/boards/${board.id}/pins/${pinId}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        throw new Error('Erreur lors du retrait du pin')
      }

      // Déplacer le pin de board vers available
      const removedPin = boardPins.find((p) => p.id === pinId)
      if (removedPin) {
        setAvailablePins([removedPin, ...availablePins])
        setBoardPins(boardPins.filter((p) => p.id !== pinId))
      }

      router.refresh()
    } catch (error) {
      console.error(error)
      alert('Erreur lors du retrait du pin')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteBoard = async () => {
    if (!confirm(`Supprimer le tableau "${board.name}" ? Cette action est irréversible.`)) {
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/boards/${board.id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        throw new Error('Erreur lors de la suppression')
      }

      router.push('/boards')
      router.refresh()
    } catch (error) {
      console.error(error)
      alert('Erreur lors de la suppression')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-screen-2xl mx-auto py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/boards"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-pinterest-black mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour aux tableaux
        </Link>

        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold">{board.name}</h1>
              {board.isPrivate && (
                <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                  <Lock className="w-4 h-4" />
                  <span className="text-sm font-medium">Secret</span>
                </div>
              )}
            </div>
            {board.description && (
              <p className="text-gray-600 mb-4">{board.description}</p>
            )}
            <p className="text-sm text-gray-500">
              {boardPins.length} pin{boardPins.length > 1 ? 's' : ''}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Ajouter des pins
            </button>
            <button
              onClick={handleDeleteBoard}
              disabled={loading}
              className="p-3 rounded-full hover:bg-gray-100 transition-colors text-red-600"
              title="Supprimer le tableau"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Pins du board */}
      {boardPins.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-gray-500 mb-4">
            Ce tableau est vide
          </p>
          <p className="text-gray-400 mb-6">
            Ajoutez des pins pour commencer à organiser vos idées
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Ajouter des pins
          </button>
        </div>
      ) : (
        <MasonryGrid pins={boardPins} onRemovePin={handleRemovePin} showRemove />
      )}

      {/* Modal pour ajouter des pins */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-2xl font-bold">Ajouter des pins</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {availablePins.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">
                    Tous vos pins sont déjà dans ce tableau !
                  </p>
                  <Link href="/create" className="btn-primary inline-flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Créer un nouveau pin
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {availablePins.map((pin) => (
                    <button
                      key={pin.id}
                      onClick={() => handleAddPin(pin.id)}
                      disabled={loading}
                      className="group relative rounded-xl overflow-hidden hover:shadow-lg transition-shadow disabled:opacity-50"
                    >
                      <Image
                        src={pin.imageUrl}
                        alt={pin.title}
                        width={200}
                        height={200}
                        className="w-full h-48 object-cover"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
                        <div className="bg-pinterest-primary text-white px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity font-semibold">
                          Ajouter
                        </div>
                      </div>
                      <div className="p-2 bg-white">
                        <p className="text-sm font-medium truncate">{pin.title}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
