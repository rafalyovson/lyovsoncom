// storage-adapter-import-placeholder
import path from 'path'
import { fileURLToPath } from 'url'

import { vercelPostgresAdapter } from '@payloadcms/db-vercel-postgres'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import sharp from 'sharp' // sharp-import
import { buildConfig } from 'payload'
import { resendAdapter } from '@payloadcms/email-resend'

import { Media } from '@/collections/Media'
import { Posts } from '@/collections/Posts'
import { Users } from '@/collections/Users'
import { plugins } from '@/plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from '@/utilities/getURL'
import { Types } from '@/collections/Types'
import { Topics } from '@/collections/Topics'
import { Projects } from '@/collections/Projects'
import { Contacts } from '@/collections/Contacts'
import { Books } from '@/collections/Books'
import { Movies } from '@/collections/Movies'
import { TvShows } from '@/collections/TvShows'
import { VideoGames } from '@/collections/VideoGames'
import { People } from '@/collections/People'
import { Notes } from '@/collections/Notes'
import { Links } from '@/collections/Links'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  // Development optimizations
  debug: process.env.NODE_ENV === 'development',

  // Skip heavy operations in development
  onInit: async (payload) => {
    if (process.env.NODE_ENV === 'development') {
      payload.logger.info('🚀 Payload CMS initialized in development mode')
    }
  },

  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    components: {
      graphics: {
        Icon: '@/components/admin/icon',
        Logo: '@/components/admin/logo',
      },
      afterLogin: ['@/components/admin/login-text'],
    },
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db: vercelPostgresAdapter({
    pool: {
      connectionString: process.env.POSTGRES_URL || '',
      // Optimized settings for faster schema introspection
      max: process.env.NODE_ENV === 'production' ? 1 : 3, // Reduce dev connections
      min: 0, // No minimum connections
      idleTimeoutMillis: 10000, // Faster idle timeout (10s)
      connectionTimeoutMillis: 15000, // Slightly reduce timeout (15s)
      allowExitOnIdle: true, // Allow process to exit when idle
    },
  }),
  collections: [
    Posts,
    Media,
    Types,
    Topics,
    Projects,
    Users,
    Contacts,
    Books,
    Movies,
    TvShows,
    VideoGames,
    People,
    Notes,
    Links,
  ],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [],
  plugins: [
    ...plugins,
    vercelBlobStorage({
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    }),
  ],
  email: resendAdapter({
    defaultFromAddress: 'notifications@mail.lyovson.com',
    defaultFromName: 'Lyovsons',
    apiKey: process.env.RESEND_API_KEY || '',
  }),
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
