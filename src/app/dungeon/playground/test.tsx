'use client';

import { Suspense, use, useMemo } from 'react';

export function Test() {
  const result = use(fetch('/api/images').then((res) => res.json()));
  const cachedResult = useMemo(() => result, [result]);
  return (
    <article className="flex flex-col w-full max-w-screen-lg gap-4 p-4 mx-auto my-4 rounded-lg shadow-lg">
      <h1>Test</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <p>test</p>
        <pre>{JSON.stringify(cachedResult, null, 2)}</pre>
      </Suspense>
    </article>
  );
}
