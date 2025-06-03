'use client'

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/utilities/cn'
import { Button } from '@/components/ui/button'
import { SearchIcon } from 'lucide-react'

export const Search: React.FC<{ className?: string }> = ({ className }) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const [value, setValue] = useState(initialQuery)

  const navigate = () => {
    const trimmed = value.trim()
    if (trimmed) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`)
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    navigate()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      navigate()
    }
  }

  return (
    <div className={cn(className)}>
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <Label htmlFor="search" className="sr-only">
          Search
        </Label>
        <Input
          id="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search"
          autoFocus
        />
        <Button type="submit" className="rounded-lg">
          <SearchIcon className="w-4 h-4" />
        </Button>
      </form>
    </div>
  )
}
