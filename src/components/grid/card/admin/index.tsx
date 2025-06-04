'use client'

import { GridCard } from '@/components/grid'
import Link from 'next/link'
import { ShieldUser, Edit } from 'lucide-react'
import { GridCardSection } from '@/components/grid'
import { useParams, usePathname } from 'next/navigation'
import { use, useMemo } from 'react'
import { getAuthAndEditUrl } from '@/actions/get-auth-and-edit-url'

export function GridCardAdmin({ className }: { className?: string }) {
  const params = useParams()
  const pathname = usePathname()

  // Create a promise for auth data based on current route
  const authPromise = useMemo(() => {
    const slug = params?.slug as string
    return getAuthAndEditUrl(slug, pathname)
  }, [params?.slug, pathname])

  // Use the 'use' hook to unwrap the promise
  const { user, editUrl } = use(authPromise)

  if (!user) {
    return null
  }

  return (
    <GridCard className={`${className}`}>
      <GridCardSection className="col-start-1 col-end-4 row-start-1 row-end-2 flex flex-col justify-center items-center gap-2">
        Welcome, {user.name}
      </GridCardSection>
      <AdminLink />
      {editUrl && <EditPost editUrl={editUrl} />}
    </GridCard>
  )
}

function EditPost({ editUrl }: { editUrl: string }) {
  return (
    <GridCardSection className="flex flex-col justify-center items-center gap-2">
      <Link
        className="flex flex-col justify-center items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
        href={editUrl}
      >
        <Edit className="w-5 h-5" />
        <span className="text-xs">Edit Post</span>
      </Link>
    </GridCardSection>
  )
}

function AdminLink() {
  return (
    <GridCardSection className="flex flex-col justify-center items-center gap-2">
      <Link
        className="flex flex-col justify-center items-center gap-2 hover:text-blue-600 transition-colors"
        href="/admin"
      >
        <ShieldUser className="w-7 h-7" />
        <span>Admin</span>
      </Link>
    </GridCardSection>
  )
}
