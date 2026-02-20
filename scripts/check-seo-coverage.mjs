import { promises as fs } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

const requiredMetadataBaseGlobs = [
  "src/app/(frontend)",
  "src/app/(payload)",
];

const requiredCanonicalFiles = [
  "src/app/(frontend)/posts/page.tsx",
  "src/app/(frontend)/notes/page.tsx",
  "src/app/(frontend)/activities/page.tsx",
  "src/app/(frontend)/projects/page.tsx",
  "src/app/(frontend)/search/page.tsx",
  "src/app/(frontend)/posts/[slug]/page.tsx",
  "src/app/(frontend)/notes/[slug]/page.tsx",
  "src/app/(frontend)/activities/[date]/[slug]/page.tsx",
  "src/app/(frontend)/projects/[project]/page.tsx",
  "src/app/(frontend)/topics/[slug]/page.tsx",
  "src/app/(frontend)/[lyovson]/page.tsx",
];

const requiredJsonLdFiles = [
  "src/app/(frontend)/posts/[slug]/page.tsx",
  "src/app/(frontend)/notes/[slug]/page.tsx",
  "src/app/(frontend)/activities/[date]/[slug]/page.tsx",
  "src/app/(frontend)/projects/[project]/page.tsx",
  "src/app/(frontend)/topics/[slug]/page.tsx",
  "src/app/(frontend)/posts/page.tsx",
  "src/app/(frontend)/notes/page.tsx",
  "src/app/(frontend)/activities/page.tsx",
  "src/app/(frontend)/projects/page.tsx",
  "src/app/(frontend)/posts/page/[pageNumber]/page.tsx",
  "src/app/(frontend)/notes/page/[pageNumber]/page.tsx",
  "src/app/(frontend)/activities/page/[pageNumber]/page.tsx",
  "src/app/(frontend)/projects/[project]/page/[pageNumber]/page.tsx",
  "src/app/(frontend)/topics/[slug]/page/[pageNumber]/page.tsx",
  "src/app/(frontend)/page.tsx",
  "src/app/(frontend)/page/[pageNumber]/page.tsx",
];

const noindexExcludedFromSitemap = ["/playground", "/subscription-confirmed"];

async function readFile(file) {
  return fs.readFile(path.join(ROOT, file), "utf8");
}

async function listFilesRecursively(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listFilesRecursively(fullPath)));
      continue;
    }
    files.push(fullPath);
  }

  return files;
}

function hasMetadataExport(source) {
  return (
    source.includes("export const metadata") ||
    source.includes("generateMetadata(")
  );
}

async function checkMetadataBase() {
  const issues = [];

  for (const relativeDir of requiredMetadataBaseGlobs) {
    const absoluteDir = path.join(ROOT, relativeDir);
    const files = await listFilesRecursively(absoluteDir);

    for (const file of files) {
      if (!file.endsWith(".ts") && !file.endsWith(".tsx")) {
        continue;
      }

      const source = await fs.readFile(file, "utf8");
      if (!hasMetadataExport(source)) {
        continue;
      }
      if (!source.includes("metadataBase")) {
        issues.push(
          `Missing metadataBase in metadata export: ${path.relative(ROOT, file)}`
        );
      }
    }
  }

  return issues;
}

async function checkCanonicalCoverage() {
  const issues = [];

  for (const file of requiredCanonicalFiles) {
    const source = await readFile(file);
    if (!source.includes("canonical")) {
      issues.push(`Missing canonical metadata: ${file}`);
    }
  }

  return issues;
}

async function checkJsonLdCoverage() {
  const issues = [];

  for (const file of requiredJsonLdFiles) {
    const source = await readFile(file);
    const hasJsonLd = source.includes("JsonLd");
    const hasSchemaGenerator = source.includes("generateCollectionPageSchema")
      || source.includes("generateArticleSchema")
      || source.includes("generatePersonSchema");

    if (!(hasJsonLd && hasSchemaGenerator)) {
      issues.push(`Missing structured data wiring: ${file}`);
    }
  }

  return issues;
}

async function checkSitemapExclusions() {
  const issues = [];
  const source = await readFile("src/app/sitemap.ts");

  for (const route of noindexExcludedFromSitemap) {
    if (source.includes(route)) {
      issues.push(`Noindex/utility route should not be in sitemap: ${route}`);
    }
  }

  return issues;
}

async function main() {
  const checks = await Promise.all([
    checkMetadataBase(),
    checkCanonicalCoverage(),
    checkJsonLdCoverage(),
    checkSitemapExclusions(),
  ]);

  const issues = checks.flat();

  if (issues.length === 0) {
    console.log("SEO coverage checks passed.");
    process.exit(0);
  }

  console.error("SEO coverage checks failed:");
  for (const issue of issues) {
    console.error(`- ${issue}`);
  }
  process.exit(1);
}

main().catch((error) => {
  console.error("SEO coverage checks crashed.");
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
