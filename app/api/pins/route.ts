import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Récupérer tous les pins
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const userId = searchParams.get('userId')
    
    const where = {
      ...(search && {
        OR: [
          { title: { contains: search } },
          { description: { contains: search } },
        ],
      }),
      ...(userId && { userId }),
    }

    const pins = await prisma.pin.findMany({
      where,
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

    return NextResponse.json(pins)
  } catch (error) {
    console.error('Erreur GET pins:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des pins' },
      { status: 500 }
    )
  }
}

// POST - Créer un nouveau pin
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
    const { title, description, imageUrl, link } = body

    if (!title || !imageUrl) {
      return NextResponse.json(
        { error: 'Titre et image requis' },
        { status: 400 }
      )
    }

    const pin = await prisma.pin.create({
      data: {
        title,
        description,
        imageUrl,
        link,
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
      },
    })

    return NextResponse.json(pin, { status: 201 })
  } catch (error) {
    console.error('Erreur POST pin:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création du pin' },
      { status: 500 }
    )
  }
}
