import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import BoardDetailClient from '@/components/BoardDetailClient'

export default async function BoardDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  const board = await prisma.board.findUnique({
    where: {
      id: params.id,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      pins: {
        include: {
          pin: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
              _count: {
                select: {
                  likes: true,
                  comments: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  })

  if (!board) {
    notFound()
  }

  // Vérifier que l'utilisateur a accès au board
  if (board.userId !== session.user.id) {
    redirect('/boards')
  }

  // Récupérer tous les pins de l'utilisateur pour pouvoir en ajouter
  const allUserPins = await prisma.pin.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  // Transformer les données pour le client
  const boardPins = board.pins.map((bp) => bp.pin)
  const boardPinIds = new Set(boardPins.map((pin) => pin.id))
  const availablePins = allUserPins.filter((pin) => !boardPinIds.has(pin.id))

  return (
    <BoardDetailClient
      board={{
        id: board.id,
        name: board.name,
        description: board.description,
        isPrivate: board.isPrivate,
        user: board.user,
      }}
      boardPins={boardPins}
      availablePins={availablePins}
    />
  )
}
