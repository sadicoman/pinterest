import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// POST - Ajouter un pin à un board
export async function POST(
  request: Request,
  { params }: { params: { boardId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const { boardId } = params
    const body = await request.json()
    const { pinId } = body

    if (!pinId) {
      return NextResponse.json(
        { error: 'Pin ID requis' },
        { status: 400 }
      )
    }

    // Vérifier que le board appartient à l'utilisateur
    const board = await prisma.board.findUnique({
      where: { id: boardId },
    })

    if (!board) {
      return NextResponse.json(
        { error: 'Tableau introuvable' },
        { status: 404 }
      )
    }

    if (board.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      )
    }

    // Vérifier que le pin existe
    const pin = await prisma.pin.findUnique({
      where: { id: pinId },
    })

    if (!pin) {
      return NextResponse.json(
        { error: 'Pin introuvable' },
        { status: 404 }
      )
    }

    // Vérifier si le pin n'est pas déjà dans le board
    const existing = await prisma.boardPin.findUnique({
      where: {
        boardId_pinId: {
          boardId,
          pinId,
        },
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Ce pin est déjà dans ce tableau' },
        { status: 400 }
      )
    }

    // Ajouter le pin au board
    const boardPin = await prisma.boardPin.create({
      data: {
        boardId,
        pinId,
      },
    })

    return NextResponse.json(
      { message: 'Pin ajouté au tableau', boardPin },
      { status: 201 }
    )
  } catch (error) {
    console.error('Erreur ajout pin au board:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'ajout du pin au tableau' },
      { status: 500 }
    )
  }
}

// DELETE - Retirer un pin d'un board
export async function DELETE(
  request: Request,
  { params }: { params: { boardId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const { boardId } = params
    const { searchParams } = new URL(request.url)
    const pinId = searchParams.get('pinId')

    if (!pinId) {
      return NextResponse.json(
        { error: 'Pin ID requis' },
        { status: 400 }
      )
    }

    // Vérifier que le board appartient à l'utilisateur
    const board = await prisma.board.findUnique({
      where: { id: boardId },
    })

    if (!board) {
      return NextResponse.json(
        { error: 'Tableau introuvable' },
        { status: 404 }
      )
    }

    if (board.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      )
    }

    // Supprimer le pin du board
    await prisma.boardPin.deleteMany({
      where: {
        boardId,
        pinId,
      },
    })

    return NextResponse.json(
      { message: 'Pin retiré du tableau' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Erreur suppression pin du board:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du pin du tableau' },
      { status: 500 }
    )
  }
}

// GET - Récupérer tous les pins d'un board
export async function GET(
  request: Request,
  { params }: { params: { boardId: string } }
) {
  try {
    const { boardId } = params

    const board = await prisma.board.findUnique({
      where: { id: boardId },
      include: {
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
        },
      },
    })

    if (!board) {
      return NextResponse.json(
        { error: 'Tableau introuvable' },
        { status: 404 }
      )
    }

    // Extraire les pins du board
    const pins = board.pins.map((bp) => bp.pin)

    return NextResponse.json({ board, pins })
  } catch (error) {
    console.error('Erreur GET board pins:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des pins' },
      { status: 500 }
    )
  }
}
