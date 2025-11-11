'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { Search, Plus, User, LogOut } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const { data: session } = useSession()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery)}`)
    }
  }

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

          {/* Barre de recherche */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-pinterest-light-gray rounded-full focus:outline-none focus:ring-2 focus:ring-pinterest-primary"
              />
            </div>
          </form>

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
