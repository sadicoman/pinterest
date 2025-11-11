import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(
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

    // Supprimer le board (cascade supprimera les BoardPin)
    await prisma.board.delete({
      where: { id: boardId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur suppression board:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du board' },
      { status: 500 }
    )
  }
}
