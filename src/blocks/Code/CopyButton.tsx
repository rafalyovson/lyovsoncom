'use client'
import { CopyIcon } from '@payloadcms/ui/icons/Copy'
import { useState } from 'react'

import { Button } from '@/components/ui/button'

export function CopyButton({ code }: { code: string }) {
  const [text, setText] = useState('Copy')

  function updateCopyStatus() {
    if (text === 'Copy') {
      setText(() => 'Copied!')
      setTimeout(() => {
        setText(() => 'Copy')
      }, 1000)
    }
  }

  return (
    <div className="absolute top-3 right-3">
      <Button
        className="glass-badge glass-interactive flex gap-2 transition-all duration-300 hover:glass-text-secondary  glass-badge px-2 py-1 text-xs font-medium rounded"
        variant="ghost"
        size="sm"
        onClick={async () => {
          await navigator.clipboard.writeText(code)
          updateCopyStatus()
        }}
      >
        <span className="glass-text sr-only">{text}</span>
        <div className="w-4 h-4 glass-text">
          <CopyIcon />
        </div>
      </Button>
    </div>
  )
}
