import PortfolioCard from "./PortfolioCard";
const Projects = () => (
  <section className="px-4 py-8 text-gray-800 bg-gray-100 border-b border-gray-300">
    <h2 className="text-2xl mb-4">Projects</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(10)].map((_, i) => (
        <PortfolioCard key={i} num={i} />
      ))}
    </div>
  </section>
);

export default Projects;
