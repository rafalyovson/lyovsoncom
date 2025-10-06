// storage-adapter-import-placeholder

import path from "node:path";
import { fileURLToPath } from "node:url";
import { vercelPostgresAdapter } from "@payloadcms/db-vercel-postgres";
import { resendAdapter } from "@payloadcms/email-resend";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import { buildConfig } from "payload";
import sharp from "sharp"; // sharp-import

import { Books } from "@/collections/Books";
import { Contacts } from "@/collections/Contacts";
import { Links } from "@/collections/Links";
import { Media } from "@/collections/Media";
import { Movies } from "@/collections/Movies";
import { Music } from "@/collections/Music";
import { Notes } from "@/collections/Notes";
import { Persons } from "@/collections/Persons";
import { Podcasts } from "@/collections/Podcasts";
import { Posts } from "@/collections/Posts";
import { Projects } from "@/collections/Projects";
import { Topics } from "@/collections/Topics";
import { TvShows } from "@/collections/TvShows";
import { Users } from "@/collections/Users";
import { VideoGames } from "@/collections/VideoGames";
import { defaultLexical } from "@/fields/defaultLexical";
import { plugins } from "@/plugins";
import { getServerSideURL } from "@/utilities/getURL";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  // Development optimizations
  debug: process.env.NODE_ENV === "development",

  // Skip heavy operations in development
  onInit: async (payload) => {
    if (process.env.NODE_ENV === "development") {
      payload.logger.info("🚀 Payload CMS initialized in development mode");
    }
  },

  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    components: {
      graphics: {
        Icon: "@/components/admin/icon",
        Logo: "@/components/admin/logo",
      },
      afterLogin: ["@/components/admin/login-text"],
    },
    livePreview: {
      breakpoints: [
        {
          label: "Mobile",
          name: "mobile",
          width: 375,
          height: 667,
        },
        {
          label: "Tablet",
          name: "tablet",
          width: 768,
          height: 1024,
        },
        {
          label: "Desktop",
          name: "desktop",
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
      connectionString: process.env.POSTGRES_URL || "",
      // Optimized settings for faster schema introspection
      max: process.env.NODE_ENV === "production" ? 1 : 3, // Reduce dev connections
      min: 0, // No minimum connections
      idleTimeoutMillis: 10_000, // Faster idle timeout (10s)
      connectionTimeoutMillis: 15_000, // Slightly reduce timeout (15s)
      allowExitOnIdle: true, // Allow process to exit when idle
    },
    // Critical: Filter out PostgreSQL extension objects to prevent Drizzle from trying to manage them
    tablesFilter: [
      // Exclude pg_stat_statements extension objects using negation
      "!pg_stat_statements",
      "!pg_stat_statements_info",

      // Exclude pgvector extension functions (they appear as tables in introspection)
      "!vector_*",
      "!halfvec_*",
      "!sparsevec_*",
      "!array_to_vector",
      "!cosine_distance",
      "!inner_product",
      "!l2_distance",
      "!l1_distance",
      "!hamming_distance",
      "!jaccard_distance",

      // Include all other tables with wildcard
      "*",
    ],
    beforeSchemaInit: [
      ({ schema }) => {
        // Preserve PostgreSQL extension objects that shouldn't be managed by Payload CMS
        // Combined with tablesFilter above, this ensures extensions work properly

        // Extensions in this database: pg_stat_statements, vector (pgvector), plpgsql
        const preservedSchema = {
          ...schema,
        };

        return preservedSchema;
      },
    ],
  }),
  collections: [
    Posts,
    Media,
    Topics,
    Projects,
    Users,
    Contacts,
    Books,
    Movies,
    TvShows,
    VideoGames,
    Music,
    Podcasts,
    Persons,
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
      token: process.env.BLOB_READ_WRITE_TOKEN || "",
    }),
  ],
  email: resendAdapter({
    defaultFromAddress: "notifications@mail.lyovson.com",
    defaultFromName: "Lyovsons",
    apiKey: process.env.RESEND_API_KEY || "",
  }),
  secret: process.env.PAYLOAD_SECRET || "",
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
});
