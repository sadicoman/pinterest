import { prisma } from '@/lib/prisma'
import MasonryGrid from '@/components/MasonryGrid'

export default async function Home({
  searchParams,
}: {
  searchParams: { search?: string }
}) {
  const search = searchParams.search

  const pins = await prisma.pin.findMany({
    where: search
      ? {
          OR: [
            { title: { contains: search } },
            { description: { contains: search } },
          ],
        }
      : undefined,
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

  return (
    <div className="max-w-screen-2xl mx-auto py-8">
      {search && (
        <h1 className="text-3xl font-bold mb-6">
          Résultats pour "{search}"
        </h1>
      )}
      
      {pins.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-gray-500">
            {search ? 'Aucun résultat trouvé' : 'Aucun pin pour le moment'}
          </p>
          <p className="text-gray-400 mt-2">
            Soyez le premier à créer un pin !
          </p>
        </div>
      ) : (
        <MasonryGrid pins={pins} />
      )}
    </div>
  )
}
