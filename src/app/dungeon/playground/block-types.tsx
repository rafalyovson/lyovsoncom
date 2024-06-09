// const YoutubeEmbedConfig = {
//   contentName: "Youtube Video",

//   exampleUrl: "https://www.youtube.com/watch?v=jNQXAC9IVRw",

//   // Icon for display.
//   icon: <i className="icon youtube" />,

//   insertNode: (editor: LexicalEditor, result: EmbedMatchResult) => {
//     editor.dispatchCommand(INSERT_YOUTUBE_COMMAND, result.id);
//   },

//   keywords: ["youtube", "video"],

//   // Determine if a given URL is a match and return url data.
//   parseUrl: async (url: string) => {
//     const match =
//       /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/.exec(url);

//     const id = match ? (match?.[2].length === 11 ? match[2] : null) : null;

//     if (id != null) {
//       return {
//         id,
//         url,
//       };
//     }

//     return null;
//   },

//   type: "youtube-video",
// };

// const TwitterEmbedConfig = {
//   // e.g. Tweet or Google Map.
//   contentName: "Tweet",

//   exampleUrl: "https://twitter.com/jack/status/20",

//   // Icon for display.
//   icon: <i className="icon tweet" />,

//   // Create the Lexical embed node from the url data.
//   insertNode: (editor: LexicalEditor, result: EmbedMatchResult) => {
//     editor.dispatchCommand(INSERT_TWEET_COMMAND, result.id);
//   },

//   // For extra searching.
//   keywords: ["tweet", "twitter"],

//   // Determine if a given URL is a match and return url data.
//   parseUrl: (text: string) => {
//     const match =
//       /^https:\/\/(twitter|x)\.com\/(#!\/)?(\w+)\/status(es)*\/(\d+)/.exec(
//         text
//       );

//     if (match != null) {
//       return {
//         id: match[5],
//         url: match[1],
//       };
//     }

//     return null;
//   },

//   type: "tweet",
// };

export const BlockTypes = [];
