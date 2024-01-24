const About = () => (
  <section className="p-4 px-4 py-8 text-xl ">
    <h2 className="mb-4 text-2xl font-bold">Welcome Friend,</h2>
    <p>
      One day very soon this will be the official website of Jess and Rafa
      Lyovsons containing articles, ideas, projects and means of communication.
      Right now its being build using the most cutting edge tech stack
      abailable. In the meantime, you can find us on X as{" "}
      <a
        target="_blank"
        rel="noopener"
        className="underline text-jess hover:text-jess-dark"
        href="https://x.com/hasmikkhachunts"
      >
        {" "}
        @hasmikkhachunts
      </a>{" "}
      and{" "}
      <a
        target="_blank"
        rel="noopener"
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
