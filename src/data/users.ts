import {
  faLinkedin,
  faSquareGithub,
  faSquareReddit,
  faSquareXTwitter,
  faSquareYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { faExternalLinkSquare } from "@fortawesome/free-solid-svg-icons";

export const users = {
  rafa: {
    name: "Rafa Lyovson",
    id: "rafa",
    image: "../images/jess.png",
    bio: "Rafa is a full stack developer",
    socials: [
      {
        name: "GitHub",
        url: "https://github.com/lyovson",
        icon: faSquareGithub,
      },
      {
        name: "X",
        url: "https://www.x.com/lyovson",
        icon: faSquareXTwitter,
      },
      {
        name: "Reddit",
        url: "https://www.reddit.com/user/Lyovson/",
        icon: faSquareReddit,
      },
      {
        name: "YouTube",
        url: "https://www.youtube.com/@lyovson",
        icon: faSquareYoutube,
      },
    ],
    menu: [
      { name: "Bio", url: "/rafa/bio", icon: faExternalLinkSquare },
      { name: "Portfolio", url: "/rafa/portfolio", icon: faExternalLinkSquare },
      { name: "Contact", url: "/rafa/contact", icon: faExternalLinkSquare },
      { name: "Project 1", url: "/rafa/project1", icon: faExternalLinkSquare },
      { name: "Project 2", url: "/rafa/project2", icon: faExternalLinkSquare },
    ],
  },
  jess: {
    name: "Jess Lyovson",
    id: "jess",
    image: "../images/jess.png",
    bio: "Jess is a copywriter and content creator",
    socials: [
      {
        name: "X",
        url: "https://www.x.com/jesslyovson",
        icon: faSquareXTwitter,
      },
      {
        name: "Reddit",
        url: "https://www.reddit.com/user/hasmikkhachunts/",
        icon: faSquareReddit,
      },
      {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/khachunts",
        icon: faLinkedin,
      },
      {
        name: "YouTube",
        url: "https://www.youtube.com/@hasmikkhachunts1741",
        icon: faSquareYoutube,
      },
    ],
    menu: [
      { name: "Bio", url: "/jess/bio", icon: faExternalLinkSquare },
      {
        name: "Portfolio",
        url: "/jess/portfolio",
        icon: faExternalLinkSquare,
      },
      { name: "Contact", url: "/jess/contact", icon: faExternalLinkSquare },
      {
        name: "Project 1",
        url: "/jess/project1",
        icon: faExternalLinkSquare,
      },
      {
        name: "Project 2",
        url: "/jess/project2",
        icon: faExternalLinkSquare,
      },
    ],
  },
};
