import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// DELETE - Retirer un pin d'un board
export async function DELETE(
  request: Request,
  { params }: { params: { boardId: string; pinId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const { boardId, pinId } = params

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
