'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, Plus, LogOut } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

interface SearchResult {
  pins: Array<{
    id: string
    title: string
    imageUrl: string
  }>
  users: Array<{
    id: string
    name: string
    image: string | null
  }>
}

export default function Navbar() {
  const { data: session } = useSession()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState<SearchResult>({ pins: [], users: [] })
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loading, setLoading] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const debounceTimer = useRef<NodeJS.Timeout>()

  // Fermer les suggestions quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Recherche avec debounce
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }

    if (searchQuery.length < 2) {
      setSuggestions({ pins: [], users: [] })
      setShowSuggestions(false)
      return
    }

    setLoading(true)

    debounceTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search/autocomplete?q=${encodeURIComponent(searchQuery)}`)
        if (res.ok) {
          const data = await res.json()
          setSuggestions(data)
          setShowSuggestions(true)
        }
      } catch (error) {
        console.error('Erreur recherche:', error)
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [searchQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery)}`)
      setShowSuggestions(false)
      setSearchQuery('')
    }
  }

  const handleSuggestionClick = (type: 'pin' | 'user', id: string) => {
    setShowSuggestions(false)
    setSearchQuery('')
    if (type === 'pin') {
      router.push(`/pin/${id}`)
    } else {
      router.push(`/user/${id}`)
    }
  }

  const hasSuggestions = suggestions.pins.length > 0 || suggestions.users.length > 0

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="max-w-screen-2xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-pinterest-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="font-bold text-xl hidden sm:block">Pinterest</span>
          </Link>

          {/* Navigation principale */}
          {session && (
            <div className="flex gap-2">
              <Link
                href="/"
                className="px-4 py-2 rounded-full hover:bg-pinterest-light-gray transition-colors font-semibold"
              >
                Accueil
              </Link>
              <Link
                href="/boards"
                className="px-4 py-2 rounded-full hover:bg-pinterest-light-gray transition-colors font-semibold"
              >
                Tableaux
              </Link>
            </div>
          )}

          {/* Barre de recherche avec autocomplete */}
          <div ref={searchRef} className="flex-1 max-w-2xl relative">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => {
                    // if (searchQuery.length >= 2 && hasSuggestions) {
                    //   setShowSuggestions(true)
                    // }
                    if (searchQuery.length >= 2) setShowSuggestions(true)
                  }}
                  className="w-full pl-12 pr-4 py-3 bg-pinterest-light-gray rounded-full focus:outline-none focus:ring-2 focus:ring-pinterest-primary"
                />
                {loading && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <div className="w-5 h-5 border-2 border-pinterest-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
            </form>

            {/* Dropdown des suggestions */}
            {showSuggestions && hasSuggestions && (
              <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden z-50">
                {/* Pins */}
                {suggestions.pins.length > 0 && (
                  <div>
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase bg-gray-50">
                      Pins
                    </div>
                    {suggestions.pins.map((pin) => (
                      <button
                        key={pin.id}
                        onClick={() => handleSuggestionClick('pin', pin.id)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-pinterest-light-gray transition-colors"
                      >
                        <Image
                          src={pin.imageUrl}
                          alt={pin.title}
                          width={50}
                          height={50}
                          className="w-12 h-12 rounded-lg object-cover"
                          unoptimized
                        />
                        <span className="text-left font-medium line-clamp-1">
                          {pin.title}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Utilisateurs */}
                {suggestions.users.length > 0 && (
                  <div>
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase bg-gray-50">
                      Utilisateurs
                    </div>
                    {suggestions.users.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => handleSuggestionClick('user', user.id)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-pinterest-light-gray transition-colors"
                      >
                        {user.image ? (
                          <Image
                            src={user.image}
                            alt={user.name || 'User'}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-full object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                            <span className="text-sm font-semibold text-white">
                              {user.name?.[0]?.toUpperCase()}
                            </span>
                          </div>
                        )}
                        <span className="text-left font-medium">{user.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Actions utilisateur */}
          <div className="flex items-center gap-3">
            {session ? (
              <>
                <Link
                  href="/create"
                  className="p-3 rounded-full hover:bg-pinterest-light-gray transition-colors"
                  title="Créer un pin"
                >
                  <Plus className="w-6 h-6" />
                </Link>

                <Link
                  href="/profile"
                  className="p-2 rounded-full hover:bg-pinterest-light-gray transition-colors"
                  title="Profil"
                >
                  {session.user?.image ? (
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      <img
                        src={session.user.image}
                        alt={session.user.name || 'User'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-white">
                        {session.user?.name?.[0]?.toUpperCase() || 'U'}
                      </span>
                    </div>
                  )}
                </Link>

                <button
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="p-3 rounded-full hover:bg-pinterest-light-gray transition-colors"
                  title="Se déconnecter"
                >
                  <LogOut className="w-6 h-6" />
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-full hover:bg-pinterest-light-gray transition-colors font-semibold"
                >
                  Connexion
                </Link>
                <Link
                  href="/register"
                  className="btn-primary"
                >
                  S'inscrire
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}