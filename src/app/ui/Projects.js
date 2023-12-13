import PortfolioCard from "./PortfolioCard.js";

const data = await fetch("https://jsonplaceholder.typicode.com/posts").then(
  (response) => response.json()
);
const Projects = () => (
  <section className="">
    <h2 className="mb-4 text-2xl text-center">Projects</h2>
    <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {data.map((post, index) => (
        <PortfolioCard key={index} post={post} />
      ))}
    </div>
  </section>
);

export default Projects;
