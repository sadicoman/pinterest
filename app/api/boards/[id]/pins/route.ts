import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const boardId = params.id
    const { pinId } = await request.json()

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

    if (!board || board.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Board introuvable' },
        { status: 404 }
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
    const existingBoardPin = await prisma.boardPin.findUnique({
      where: {
        boardId_pinId: {
          boardId,
          pinId,
        },
      },
    })

    if (existingBoardPin) {
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

    return NextResponse.json(boardPin, { status: 201 })
  } catch (error) {
    console.error('Erreur ajout pin au board:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'ajout du pin' },
      { status: 500 }
    )
  }
}
