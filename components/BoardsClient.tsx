'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, X, Lock } from 'lucide-react'

interface Board {
  id: string
  name: string
  description?: string
  isPrivate: boolean
  _count: {
    pins: number
  }
  pins: {
    pin: {
      imageUrl: string
    }
  }[]
}

interface BoardsClientProps {
  initialBoards: Board[]
}

export default function BoardsClient({ initialBoards }: BoardsClientProps) {
  const router = useRouter()
  const [boards, setBoards] = useState(initialBoards)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPrivate: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/boards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        throw new Error('Erreur lors de la création du tableau')
      }

      const newBoard = await res.json()

      // Ajouter le nouveau board à la liste
      setBoards([
        {
          ...newBoard,
          _count: { pins: 0 },
          pins: [],
        },
        ...boards,
      ])

      // Réinitialiser le formulaire et fermer le modal
      setFormData({ name: '', description: '', isPrivate: false })
      setIsModalOpen(false)
      router.refresh()
    } catch (error) {
      setError('Une erreur est survenue')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-screen-2xl mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Mes Tableaux</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Créer un tableau
        </button>
      </div>

      {boards.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-gray-500 mb-4">
            Vous n'avez pas encore de tableaux
          </p>
          <p className="text-gray-400 mb-6">
            Créez votre premier tableau pour organiser vos pins
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Créer mon premier tableau
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {boards.map((board) => (
            <Link key={board.id} href={`/board/${board.id}`} className="group">
              <div className="bg-pinterest-light-gray rounded-2xl overflow-hidden aspect-square mb-2 relative">
                {board.pins[0] ? (
                  <Image
                    src={board.pins[0].pin.imageUrl}
                    alt={board.name}
                    width={300}
                    height={300}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Plus className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                {board.isPrivate && (
                  <div className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-2">
                    <Lock className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-lg group-hover:underline">
                  {board.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {board._count.pins} pin{board._count.pins > 1 ? 's' : ''}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Modal de création */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold mb-6">Créer un tableau</h2>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold mb-2">
                  Nom du tableau *
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="input-field"
                  placeholder="Ex: Recettes, Voyages, Inspiration..."
                  autoFocus
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-semibold mb-2"
                >
                  Description (optionnel)
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="input-field min-h-[100px] resize-none"
                  placeholder="Décrivez votre tableau..."
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  id="isPrivate"
                  type="checkbox"
                  checked={formData.isPrivate}
                  onChange={(e) =>
                    setFormData({ ...formData, isPrivate: e.target.checked })
                  }
                  className="w-5 h-5 text-pinterest-primary border-gray-300 rounded focus:ring-pinterest-primary"
                />
                <label htmlFor="isPrivate" className="text-sm font-medium flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Garder ce tableau secret
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary flex-1"
                  disabled={loading}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? 'Création...' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
