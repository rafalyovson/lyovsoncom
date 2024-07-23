import { Test } from '@/app/dungeon/playground/test';

async function Playground() {
  return (
    <article className="flex flex-col w-full max-w-screen-lg gap-4 p-4 mx-auto my-4 rounded-lg shadow-lg">
      <h1>Playground</h1>
      <Test />
    </article>
  );
}
export default Playground;
