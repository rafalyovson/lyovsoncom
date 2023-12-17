const About = () => (
  <section className="p-4 px-4 py-8 text-xl rounded-lg shadow-lg bg-gray-50 dark:bg-dark">
    <h2 className="mb-4 text-2xl font-bold text-gray-700 dark:text-light">
      Welcome Friend,
    </h2>
    <p className="text-gray-600 dark:text-gray-300">
      One day very soon this will be the official website of Jess and Rafa
      Lyovsons containing articles, ideas, projects and means of communication.
      Right now its being build using the most cutting edge tech stack
      abailable. In the meantime, you can find us on X as{" "}
      <a
        target="_blank"
        className="underline text-jess hover:text-jess-dark"
        href="https://x.com/hasmikkhachunts"
      >
        {" "}
        @hasmikkhacnuts
      </a>{" "}
      and{" "}
      <a
        target="_blank"
        className="underline text-rafa hover:text-rafa-dark"
        href="https://x.com/lyovson"
      >
        {" "}
        @lyovson
      </a>{" "}
      respectively.
    </p>
  </section>
);

export default About;
