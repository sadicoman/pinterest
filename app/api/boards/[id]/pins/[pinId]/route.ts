import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; pinId: string } }
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
    const pinId = params.pinId

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

    // Supprimer la relation board-pin
    await prisma.boardPin.deleteMany({
      where: {
        boardId,
        pinId,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur retrait pin du board:', error)
    return NextResponse.json(
      { error: 'Erreur lors du retrait du pin' },
      { status: 500 }
    )
  }
}
