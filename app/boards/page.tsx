import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import { Plus } from 'lucide-react'

export default async function BoardsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  const boards = await prisma.board.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      _count: {
        select: {
          pins: true,
        },
      },
      pins: {
        take: 1,
        include: {
          pin: {
            select: {
              imageUrl: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <div className="max-w-screen-2xl mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Mes Tableaux</h1>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Créer un tableau
        </button>
      </div>

      {boards.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-gray-500 mb-4">
            Vous n'avez pas encore de tableaux
          </p>
          <p className="text-gray-400">
            Créez votre premier tableau pour organiser vos pins
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {boards.map((board) => (
            <Link
              key={board.id}
              href={`/board/${board.id}`}
              className="group"
            >
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
  )
}
