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

    const pinId = params.id

    // Vérifier si le pin existe
    const pin = await prisma.pin.findUnique({
      where: { id: pinId },
    })

    if (!pin) {
      return NextResponse.json(
        { error: 'Pin introuvable' },
        { status: 404 }
      )
    }

    // Vérifier si déjà liké
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_pinId: {
          userId: session.user.id,
          pinId,
        },
      },
    })

    if (existingLike) {
      // Unliker
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      })

      return NextResponse.json({ liked: false })
    } else {
      // Liker
      await prisma.like.create({
        data: {
          userId: session.user.id,
          pinId,
        },
      })

      return NextResponse.json({ liked: true })
    }
  } catch (error) {
    console.error('Erreur like:', error)
    return NextResponse.json(
      { error: 'Erreur lors du like' },
      { status: 500 }
    )
  }
}
