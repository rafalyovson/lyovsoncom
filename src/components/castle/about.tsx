import { Card, CardContent, CardHeader } from '@/components/shadcn/ui/card';

export const About = () => (
  <Card className="w-full max-w-[95%] lg:max-w-[800px] mx-auto p-6 bg-gradient-to-r from-[#f0f0f0] to-[#e0e0e0] dark:from-[#1c1c1e] dark:to-[#121212] text-gray-800 dark:text-gray-200 rounded-lg shadow-md  hover:shadow-lg">
    <CardHeader>
      <h2 className="mb-4 text-3xl lg:text-5xl font-bold text-primary dark:text-primary-light text-center lg:text-left">
        Welcome, Friend!
      </h2>
    </CardHeader>
    <CardContent>
      <p className="text-base lg:text-lg leading-relaxed text-center lg:text-left">
        One day very soon this will be the official website of Jess and Rafa
        Lyovsons containing articles, ideas, projects, and means of
        communication. Right now, it&apos;s being built using the most
        cutting-edge tech stack available. In the meantime, you can find us on X
        as
        <span className="inline-block">
          <a
            target="_blank"
            rel="noopener"
            className="underline  hover:text-pink-400 mx-1 text-pink-600"
            href="https://x.com/jesslyovson"
          >
            @jesslyovson
          </a>
        </span>
        and
        <span className="inline-block mx-1">
          <a
            target="_blank"
            rel="noopener"
            className="underline  hover:text-indigo-400 text-indigo-600"
            href="https://x.com/lyovson"
          >
            @lyovson
          </a>
        </span>
        respectively.
      </p>
    </CardContent>
  </Card>
);
