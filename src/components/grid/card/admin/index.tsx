"use client";

import { Edit, ShieldUser } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import { use, useMemo } from "react";
import { getAuthAndEditUrl } from "@/actions/get-auth-and-edit-url";
import { GridCard, GridCardNavItem, GridCardSection } from "@/components/grid";
import { cn } from "@/lib/utils";

export function GridCardAdmin({ className }: { className?: string }) {
  const params = useParams();
  const pathname = usePathname();

  // Create a promise for auth data based on current route
  const authPromise = useMemo(() => {
    const slug = params?.slug as string;
    return getAuthAndEditUrl(slug, pathname);
  }, [params?.slug, pathname]);

  // Use the 'use' hook to unwrap the promise
  const { user, editUrl } = use(authPromise);

  if (!user) {
    return null;
  }

  return (
    <GridCard className={cn(className)}>
      <GridCardSection className="col-start-1 col-end-4 row-start-1 row-end-2 flex flex-col items-center justify-center gap-2">
        Welcome, {user.name}
      </GridCardSection>
      <AdminLink />
      {editUrl && <EditPost editUrl={editUrl} />}
    </GridCard>
  );
}

function EditPost({ editUrl }: { editUrl: string }) {
  return (
    <GridCardNavItem href={editUrl} variant="link">
      <Edit className="h-5 w-5" />
      <span className="text-xs">Edit Post</span>
    </GridCardNavItem>
  );
}

function AdminLink() {
  return (
    <GridCardNavItem href="/admin" variant="link">
      <ShieldUser className="h-7 w-7" />
      <span>Admin</span>
    </GridCardNavItem>
  );
}
