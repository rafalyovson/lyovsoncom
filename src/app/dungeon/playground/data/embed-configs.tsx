import { faXTwitter, faYoutube } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  EmbedConfig,
  EmbedMatchResult,
} from "@lexical/react/LexicalAutoEmbedPlugin";
import type { LexicalEditor } from "lexical";
import { INSERT_TWEET_COMMAND } from "../plugins/x-plugin/x-plugin";
import { INSERT_YOUTUBE_COMMAND } from "../plugins/youtube-plugin/youtube-plugin";

export interface EmbedConfigType extends EmbedConfig {
  // Human readable name of the embeded content e.g. Tweet or Google Map.
  contentName: string;

  // Icon for display.
  icon?: JSX.Element;

  // An example of a matching url https://twitter.com/jack/status/20
  exampleUrl: string;

  // For extra searching.
  keywords: Array<string>;

  // Embed a Figma Project.
  description?: string;
}

export const YoutubeEmbedConfig: EmbedConfigType = {
  contentName: "Youtube Video",

  exampleUrl: "https://www.youtube.com/watch?v=jNQXAC9IVRw",

  // Icon for display.
  icon: <FontAwesomeIcon icon={faYoutube} className="mr-2 w-4 h-4 " />,

  insertNode: (editor: LexicalEditor, result: EmbedMatchResult) => {
    editor.dispatchCommand(INSERT_YOUTUBE_COMMAND, result.url);
  },

  keywords: ["youtube", "video"],

  // Determine if a given URL is a match and return url data.
  parseUrl: async (url: string) => {
    const match =
      /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/.exec(url);

    const id = match ? (match?.[2].length === 11 ? match[2] : null) : null;

    if (id != null) {
      return {
        id,
        url,
      };
    }

    return null;
  },

  type: "youtube-video",
};

export const XEmbedConfig: EmbedConfigType = {
  // e.g. Tweet or Google Map.
  contentName: "X",

  exampleUrl: "https://x.com/jack/status/20",

  // Icon for display.
  icon: <FontAwesomeIcon icon={faXTwitter} className="mr-2 w-4 h-4 " />,

  // Create the Lexical embed node from the url data.
  insertNode: (editor: LexicalEditor, result: EmbedMatchResult) => {
    console.log("result", result);
    editor.dispatchCommand(INSERT_TWEET_COMMAND, result.url);
  },

  // For extra searching.
  keywords: ["tweet", "twitter", "x", "x.com"],

  // Determine if a given URL is a match and return url data.
  parseUrl: (text: string) => {
    const match =
      /^https:\/\/(twitter|x)\.com\/(#!\/)?(\w+)\/status(es)*\/(\d+)/.exec(
        text
      );

    if (match != null) {
      return {
        id: match[5],
        url: match[1],
      };
    }

    return null;
  },

  type: "x",
};

export const EmbedConfigs = [XEmbedConfig, YoutubeEmbedConfig];
