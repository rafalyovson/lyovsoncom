'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/utilities/cn'

export const Search: React.FC<{ className?: string }> = ({ className }) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const value = searchParams.get('q') || ''

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    const encoded = encodeURIComponent(newValue.trim())

    // Only push if not empty
    if (encoded) {
      router.push(`/search?q=${encoded}`)
    }
  }

  return (
    <div className={cn(className)}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
        }}
      >
        <Label htmlFor="search" className="sr-only">
          Search
        </Label>
        <Input
          id="search"
          defaultValue={value}
          placeholder="Search"
          onChange={handleChange}
          autoFocus
        />
        <button type="submit" className="sr-only">
          Submit
        </button>
      </form>
    </div>
  )
}
