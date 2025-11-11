'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useDropzone } from 'react-dropzone'
import { Upload, X } from 'lucide-react'
import Image from 'next/image'

export default function CreatePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link: '',
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    },
    maxFiles: 1,
  })

  const removeImage = () => {
    setImageFile(null)
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview)
    }
    setImagePreview(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!imageFile) {
      setError('Veuillez sélectionner une image')
      return
    }

    if (!formData.title) {
      setError('Le titre est requis')
      return
    }

    setLoading(true)

    try {
      // 1. Upload de l'image
      const uploadFormData = new FormData()
      uploadFormData.append('file', imageFile)

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      })

      if (!uploadRes.ok) {
        throw new Error("Erreur lors de l'upload de l'image")
      }

      const { imageUrl } = await uploadRes.json()

      // 2. Créer le pin
      const pinRes = await fetch('/api/pins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          imageUrl,
        }),
      })

      if (!pinRes.ok) {
        throw new Error('Erreur lors de la création du pin')
      }

      router.push('/')
      router.refresh()
    } catch (error) {
      setError('Une erreur est survenue')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Créer un Pin</h1>

      {error && (
        <div className="mb-4 p-3 bg-primary-100 border border-primary-400 text-primary-700 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Zone d'upload d'image */}
          <div>
            {!imagePreview ? (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? 'border-pinterest-primary bg-primary-50'
                    : 'border-gray-300 hover:border-pinterest-primary'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-semibold mb-2">
                  {isDragActive
                    ? 'Déposez votre image ici'
                    : 'Glissez-déposez ou cliquez pour uploader'}
                </p>
                <p className="text-sm text-gray-500">
                  PNG, JPG, GIF jusqu'à 10MB
                </p>
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden">
                <Image
                  src={imagePreview}
                  alt="Aperçu"
                  width={500}
                  height={500}
                  className="w-full h-auto"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Formulaire */}
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-semibold mb-2">
                Titre *
              </label>
              <input
                id="title"
                type="text"
                requiprimary
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="input-field"
                placeholder="Donnez un titre à votre pin"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-semibold mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="input-field min-h-[120px] resize-none"
                placeholder="Décrivez votre pin"
              />
            </div>

            <div>
              <label htmlFor="link" className="block text-sm font-semibold mb-2">
                Lien (optionnel)
              </label>
              <input
                id="link"
                type="url"
                value={formData.link}
                onChange={(e) =>
                  setFormData({ ...formData, link: e.target.value })
                }
                className="input-field"
                placeholder="https://exemple.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Création...' : 'Créer le Pin'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
