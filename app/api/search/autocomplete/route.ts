import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query || query.length < 2) {
      return NextResponse.json({ pins: [], users: [] })
    }

    // ✅ Rechercher dans les pins (MariaDB compatible)
    const pins = await prisma.pin.findMany({
      where: {
        OR: [
          { title: { contains: query } },
          { description: { contains: query } },
        ],
      },
      select: {
        id: true,
        title: true,
        imageUrl: true,
      },
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
    })

    // ✅ Rechercher dans les utilisateurs (MariaDB compatible)
    const users = await prisma.user.findMany({
      where: {
        name: { contains: query },
      },
      select: {
        id: true,
        name: true,
        image: true,
      },
      take: 3,
    })

    return NextResponse.json({
      pins,
      users,
    })
  } catch (error) {
    console.error('Erreur autocomplete:', error)
    return NextResponse.json({ pins: [], users: [] })
  }
}
