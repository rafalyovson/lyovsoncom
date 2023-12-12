import PortfolioCard from "./PortfolioCard";

const data = await fetch("https://jsonplaceholder.typicode.com/posts").then(
  (response) => response.json()
);
const Projects = () => (
  <section className=" px-4 py-8 text-gray-800 bg-gray-100 border-b border-gray-300">
    <h2 className="text-2xl mb-4">Projects</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {data.map((post: any, index: number) => (
        <PortfolioCard key={index} post={post} />
      ))}
    </div>
  </section>
);

export default Projects;
