import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Récupérer les boards de l'utilisateur connecté
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
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

    return NextResponse.json(boards)
  } catch (error) {
    console.error('Erreur GET boards:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des boards' },
      { status: 500 }
    )
  }
}

// POST - Créer un nouveau board
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, description, isPrivate } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Le nom est requis' },
        { status: 400 }
      )
    }

    const board = await prisma.board.create({
      data: {
        name,
        description,
        isPrivate: isPrivate || false,
        userId: session.user.id,
      },
    })

    return NextResponse.json(board, { status: 201 })
  } catch (error) {
    console.error('Erreur POST board:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création du board' },
      { status: 500 }
    )
  }
}
