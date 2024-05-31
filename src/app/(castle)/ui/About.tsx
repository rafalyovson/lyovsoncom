import { Card, CardContent, CardHeader } from "@/components/ui/card";

const About = () => (
  <Card className="w-full max-w-[600px] mx-auto p-4">
    <CardHeader>
      <h2 className="mb-4 text-5xl font-bold font-lusitana">
        Welcome, Friend!
      </h2>
    </CardHeader>
    <CardContent>
      <p>
        One day very soon this will be the official website of Jess and Rafa
        Lyovsons containing articles, ideas, projects and means of
        communication. Right now its being build using the most cutting edge
        tech stack abailable. In the meantime, you can find us on X as{" "}
        <a
          target="_blank"
          rel="noopener"
          className="underline text-jess hover:text-jess-dark"
          href="https://x.com/jesslyovson"
        >
          {" "}
          @jesslyovson
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
    </CardContent>
  </Card>
);

export default About;
