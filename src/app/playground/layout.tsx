import { ReactNode } from 'react'
import { cn } from 'src/utilities/cn'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import './globals.css'
import { Grid } from '@/components/grid'
import { Providers } from '@/providers'

export default async function PlaygroundLayout({ children }: { children: ReactNode }) {
  return (
    <html
      data-theme="dark"
      className={cn(GeistSans.variable, GeistMono.variable)}
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <title>Playground</title>
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body className="bg-background text-foreground">
        <Providers>
          <Grid>{children}</Grid>
        </Providers>
      </body>
    </html>
  )
}
