const redirects = () => {
  const internetExplorerRedirect = {
    destination: "/ie-incompatible.html",
    has: [
      {
        type: "header",
        key: "user-agent",
        value: "(.*Trident.*)", // all ie browsers
      },
    ],
    permanent: false,
    source: "/:path((?!ie-incompatible.html$).*)", // all pages except the incompatibility page
  };

  const specificPostRedirects = [
    {
      source:
        "/posts/the-truth-vs-an-opinion-how-to-become-the-media-that-wont-suck",
      destination:
        "/media-musings/the-truth-vs-an-opinion-how-to-become-the-media-that-wont-suck",
      permanent: true,
    },
    {
      source: "/posts/bye-bye-apple-tv",
      destination: "/media-musings/bye-bye-apple-tv",
      permanent: true,
    },
    {
      source: "/posts/slow-horses-personified",
      destination: "/media-musings/slow-horses-personified",
      permanent: true,
    },
    {
      source: "/posts/a-vardavar-tale-my-water-drenched-childhood-trauma",
      destination:
        "/media-musings/a-vardavar-tale-my-water-drenched-childhood-trauma",
      permanent: true,
    },
    {
      source: "/posts/stardew-valley-sucks-you-in",
      destination: "/media-musings/stardew-valley-sucks-you-in",
      permanent: true,
    },
    {
      source: "/posts/quell-the-sequels-the-capitalism-of-familiarity",
      destination:
        "/media-musings/quell-the-sequels-the-capitalism-of-familiarity",
      permanent: true,
    },
  ];

  const allRedirects = [internetExplorerRedirect, ...specificPostRedirects];

  return allRedirects;
};

export default redirects;
