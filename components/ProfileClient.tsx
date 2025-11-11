'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Camera, Edit2, Plus, Grid, Bookmark } from 'lucide-react'
import MasonryGrid from './MasonryGrid'

interface User {
  id: string
  name: string | null
  email: string
  image: string | null
  bio: string | null
  _count: {
    pins: number
    boards: number
    followers: number
    following: number
  }
}

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
  _count: {
    pins: number
  }
  pins: Array<{
    pin: {
      imageUrl: string
    }
  }>
}

interface ProfileClientProps {
  user: User
  pins: Pin[]
  boards: Board[]
}

export default function ProfileClient({ user, pins, boards }: ProfileClientProps) {
  const [activeTab, setActiveTab] = useState<'pins' | 'boards'>('pins')
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editForm, setEditForm] = useState({
    name: user.name || '',
    bio: user.bio || '',
  })
  const [loading, setLoading] = useState(false)

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/user', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      })

      if (!res.ok) {
        throw new Error('Erreur lors de la mise à jour')
      }

      window.location.reload()
    } catch (error) {
      console.error(error)
      alert('Erreur lors de la mise à jour du profil')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-screen-xl mx-auto py-8">
      {/* Header du profil */}
      <div className="text-center mb-8">
        {/* Photo de profil */}
        <div className="relative inline-block mb-4">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name || 'User'}
              width={120}
              height={120}
              className="rounded-full"
            />
          ) : (
            <div className="w-30 h-30 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-4xl font-bold text-white">
                {user.name?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>
          )}
          <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors">
            <Camera className="w-5 h-5" />
          </button>
        </div>

        {/* Nom et bio */}
        <h1 className="text-4xl font-bold mb-2">{user.name}</h1>
        <p className="text-gray-600 mb-4">{user.email}</p>
        {user.bio && <p className="text-gray-700 max-w-2xl mx-auto mb-6">{user.bio}</p>}

        {/* Statistiques */}
        <div className="flex justify-center gap-8 mb-6">
          <div className="text-center">
            <p className="text-2xl font-bold">{user._count.pins}</p>
            <p className="text-sm text-gray-600">Pins</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{user._count.boards}</p>
            <p className="text-sm text-gray-600">Tableaux</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{user._count.followers}</p>
            <p className="text-sm text-gray-600">Abonnés</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{user._count.following}</p>
            <p className="text-sm text-gray-600">Abonnements</p>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="btn-secondary inline-flex items-center gap-2"
          >
            <Edit2 className="w-4 h-4" />
            Modifier le profil
          </button>
          <Link href="/create" className="btn-primary inline-flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Créer un pin
          </Link>
        </div>
      </div>

      {/* Onglets */}
      <div className="flex justify-center gap-8 border-b mb-8">
        <button
          onClick={() => setActiveTab('pins')}
          className={`flex items-center gap-2 px-4 py-3 font-semibold transition-colors ${
            activeTab === 'pins'
              ? 'text-pinterest-black border-b-2 border-pinterest-primary'
              : 'text-gray-500 hover:text-pinterest-black'
          }`}
        >
          <Grid className="w-5 h-5" />
          Pins créés
        </button>
        <button
          onClick={() => setActiveTab('boards')}
          className={`flex items-center gap-2 px-4 py-3 font-semibold transition-colors ${
            activeTab === 'boards'
              ? 'text-pinterest-black border-b-2 border-pinterest-primary'
              : 'text-gray-500 hover:text-pinterest-black'
          }`}
        >
          <Bookmark className="w-5 h-5" />
          Tableaux
        </button>
      </div>

      {/* Contenu des onglets */}
      {activeTab === 'pins' ? (
        pins.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500 mb-4">Aucun pin créé</p>
            <p className="text-gray-400 mb-6">Commencez à créer vos propres pins !</p>
            <Link href="/create" className="btn-primary inline-flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Créer un pin
            </Link>
          </div>
        ) : (
          <MasonryGrid pins={pins} />
        )
      ) : (
        <div>
          {boards.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-500 mb-4">Aucun tableau créé</p>
              <p className="text-gray-400 mb-6">Créez des tableaux pour organiser vos pins</p>
              <Link href="/boards" className="btn-primary inline-flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Créer un tableau
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {boards.map((board) => (
                <Link key={board.id} href={`/board/${board.id}`} className="group">
                  <div className="bg-pinterest-light-gray rounded-2xl overflow-hidden aspect-square mb-2">
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
        </div>
      )}

      {/* Modal d'édition du profil */}
      {isEditModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setIsEditModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl p-8 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-6">Modifier le profil</h2>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold mb-2">
                  Nom
                </label>
                <input
                  id="name"
                  type="text"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  className="input-field"
                  placeholder="Votre nom"
                />
              </div>

              <div>
                <label htmlFor="bio" className="block text-sm font-semibold mb-2">
                  Bio
                </label>
                <textarea
                  id="bio"
                  value={editForm.bio}
                  onChange={(e) =>
                    setEditForm({ ...editForm, bio: e.target.value })
                  }
                  className="input-field min-h-[120px] resize-none"
                  placeholder="Parlez-nous de vous..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="btn-secondary flex-1"
                  disabled={loading}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1"
                  disabled={loading}
                >
                  {loading ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
