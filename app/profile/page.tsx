import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ProfileClient from '@/components/ProfileClient'

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  // Récupérer les données complètes de l'utilisateur
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      _count: {
        select: {
          pins: true,
          boards: true,
          followers: true,
          following: true,
        },
      },
    },
  })

  if (!user) {
    redirect('/login')
  }

  // Récupérer les pins de l'utilisateur
  const pins = await prisma.pin.findMany({
    where: {
      userId: user.id,
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

  // Récupérer les boards de l'utilisateur
  const boards = await prisma.board.findMany({
    where: {
      userId: user.id,
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
    <ProfileClient
      user={{
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        bio: user.bio,
        _count: user._count,
      }}
      pins={pins}
      boards={boards}
    />
  )
}
