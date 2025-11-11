import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import BoardsClient from '@/components/BoardsClient'

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

  return <BoardsClient initialBoards={boards} />
}
