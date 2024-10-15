import { imageSelectAll } from '@/data/actions/db-actions/image';
import { Image } from '@/data/schema';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/shadcn/ui/pagination';
import { imageCount } from '@/data/actions/db-actions/image/image-select-all';
import { ImageCard } from '@/components/dungeon/image-card';
import { capitalize } from '@/lib/utils';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; group?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params?.page) || 1;
  const group = params?.group;
  const limit = 5;
  const result = await imageSelectAll({
    page: Number(page),
    limit: limit,
    group: group,
  });
  if (!result.success || !result.images) {
    return <h1>No images</h1>;
  }
  const pageNumber = Math.ceil((await imageCount({ group: group })) / limit);

  return (
    <>
      <h1>{group ? capitalize(group) + ' Images' : 'All Images'}</h1>
      <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 max-w-full mx-auto">
        {result.images.map((image: Image) => (
          <ImageCard key={image.id} image={image} />
        ))}
      </main>
      <Pagination>
        <PaginationContent>
          {page > 1 && (
            <PaginationItem>
              <PaginationPrevious
                href={{
                  pathname: '/dungeon/images',
                  query: {
                    page: page > 1 ? page - 1 : 1,
                    group: params?.group,
                  },
                }}
              />
            </PaginationItem>
          )}

          {page > 2 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationLink
              href={{
                pathname: '/dungeon/images',
                query: {
                  page:
                    page < 2 ? 1 : page === pageNumber ? page - 2 : page - 1,
                  group: params?.group,
                },
              }}
              className={page === 1 ? 'underline' : ''}
            >
              {page < 2 ? 1 : page === pageNumber ? page - 2 : page - 1}
            </PaginationLink>
          </PaginationItem>
          {pageNumber > 1 && (
            <PaginationItem>
              <PaginationLink
                href={{
                  pathname: '/dungeon/images',
                  query: {
                    page:
                      page === 1 ? 2 : page === pageNumber ? page - 1 : page,
                    group: params?.group,
                  },
                }}
                className={page !== 1 && page !== pageNumber ? 'underline' : ''}
              >
                {page === 1 ? 2 : page === pageNumber ? page - 1 : page}
              </PaginationLink>
            </PaginationItem>
          )}
          {pageNumber > 2 && (
            <PaginationItem>
              <PaginationLink
                href={{
                  pathname: '/dungeon/images',
                  query: {
                    page:
                      page === pageNumber
                        ? pageNumber
                        : page === 1
                          ? page + 2
                          : page + 1,
                    group: params?.group,
                  },
                }}
                className={page === pageNumber ? 'underline' : ''}
              >
                {page === pageNumber
                  ? pageNumber
                  : page === 1
                    ? page + 2
                    : page + 1}
              </PaginationLink>
            </PaginationItem>
          )}

          {page < pageNumber - 1 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
          {page < pageNumber && (
            <PaginationItem>
              <PaginationNext
                href={{
                  pathname: '/dungeon/images',
                  query: {
                    page: page < pageNumber ? page + 1 : pageNumber,
                    group: params?.group,
                  },
                }}
              />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </>
  );
}
