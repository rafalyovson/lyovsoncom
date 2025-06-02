import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Lyovson.com - Writing, Projects & Research',
    short_name: 'Lyovson',
    description:
      'Official website of Rafa and Jess Lyovson featuring writing, projects, and research on programming, design, philosophy, and technology.',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
    orientation: 'portrait-primary',
    scope: '/',
    lang: 'en-US',
    categories: ['blog', 'education', 'technology', 'lifestyle'],
    icons: [
      {
        src: '/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
      {
        src: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    screenshots: [
      {
        src: '/screenshot-wide.png',
        sizes: '1280x720',
        type: 'image/png',
        form_factor: 'wide',
        label: 'Lyovson.com Homepage',
      },
      {
        src: '/screenshot-narrow.png',
        sizes: '640x1136',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'Lyovson.com Mobile View',
      },
    ],
    related_applications: [],
    prefer_related_applications: false,
  }
}
