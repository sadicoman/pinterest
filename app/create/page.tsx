'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useDropzone } from 'react-dropzone'
import { Upload, X } from 'lucide-react'
import Image from 'next/image'

interface ImagePreview {
  file: File
  preview: string
  title: string
  description: string
  link: string
}

export default function CreatePage() {
  const router = useRouter()
  const [images, setImages] = useState<ImagePreview[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [progress, setProgress] = useState(0)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newImages = acceptedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      title: '',
      description: '',
      link: '',
    }))
    setImages((prev) => [...prev, ...newImages])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    },
    multiple: true,
  })

  const removeImage = (index: number) => {
    setImages((prev) => {
      const newImages = [...prev]
      URL.revokeObjectURL(newImages[index].preview)
      newImages.splice(index, 1)
      return newImages
    })
  }

  const updateImage = (index: number, field: keyof ImagePreview, value: string) => {
    setImages((prev) => {
      const newImages = [...prev]
      newImages[index] = { ...newImages[index], [field]: value }
      return newImages
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setProgress(0)

    if (images.length === 0) {
      setError('Veuillez sélectionner au moins une image')
      return
    }

    const missingTitles = images.some((img) => !img.title.trim())
    if (missingTitles) {
      setError('Tous les pins doivent avoir un titre')
      return
    }

    setLoading(true)

    try {
      // Upload et création en parallèle
      const promises = images.map(async (image, index) => {
        // 1. Upload de l'image
        const uploadFormData = new FormData()
        uploadFormData.append('file', image.file)

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        })

        if (!uploadRes.ok) {
          throw new Error(`Erreur upload: ${image.file.name}`)
        }

        const { imageUrl } = await uploadRes.json()

        // 2. Créer le pin
        const pinRes = await fetch('/api/pins', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: image.title,
            description: image.description,
            link: image.link,
            imageUrl,
          }),
        })

        if (!pinRes.ok) {
          throw new Error(`Erreur création pin: ${image.title}`)
        }

        // Mettre à jour la progression
        setProgress(Math.round(((index + 1) / images.length) * 100))

        return pinRes.json()
      })

      await Promise.all(promises)

      // Tout est OK, redirection
      router.push('/')
      router.refresh()
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Une erreur est survenue')
      console.error(error)
    } finally {
      setLoading(false)
      setProgress(0)
    }
  }

  return (
    <div className="max-w-6xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">
        Créer {images.length > 0 ? `${images.length} Pin${images.length > 1 ? 's' : ''}` : 'des Pins'}
      </h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {loading && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-900">
              Upload en cours...
            </span>
            <span className="text-sm font-bold text-blue-900">{progress}%</span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div
              className="bg-pinterest-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Zone d'upload */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-pinterest-primary bg-blue-50'
              : 'border-gray-300 hover:border-pinterest-primary'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-lg font-semibold mb-2">
            {isDragActive
              ? 'Déposez vos images ici'
              : 'Glissez-déposez ou cliquez pour uploader plusieurs images'}
          </p>
          <p className="text-sm text-gray-500">
            PNG, JPG, GIF jusqu'à 10MB par image
          </p>
        </div>

        {/* Grille des images uploadées */}
        {images.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-4 space-y-4"
              >
                {/* Image preview */}
                <div className="relative rounded-lg overflow-hidden">
                  <Image
                    src={image.preview}
                    alt={`Preview ${index + 1}`}
                    width={300}
                    height={300}
                    className="w-full h-48 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Formulaire pour ce pin */}
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Titre *"
                    value={image.title}
                    onChange={(e) => updateImage(index, 'title', e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-pinterest-primary focus:outline-none text-sm"
                    required
                  />
                  <textarea
                    placeholder="Description"
                    value={image.description}
                    onChange={(e) => updateImage(index, 'description', e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-pinterest-primary focus:outline-none text-sm resize-none"
                    rows={2}
                  />
                  <input
                    type="url"
                    placeholder="Lien (optionnel)"
                    value={image.link}
                    onChange={(e) => updateImage(index, 'link', e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-pinterest-primary focus:outline-none text-sm"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bouton de soumission */}
        {images.length > 0 && (
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary px-8 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? `Création en cours...`
                : `Créer ${images.length} Pin${images.length > 1 ? 's' : ''}`}
            </button>
          </div>
        )}
      </form>
    </div>
  )
}
