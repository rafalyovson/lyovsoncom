import {
  faDungeon,
  faFileText,
  faImage,
  faTowerObservation,
  faUser,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const DungeonLinks = [
  {
    name: "Castle",
    url: "/",
    icon: (
      <FontAwesomeIcon icon={faTowerObservation} className="rounded-full" />
    ),
  },
  {
    name: "Dungeon",
    url: "/dungeon",
    icon: <FontAwesomeIcon icon={faDungeon} className="rounded-full" />,
  },
  {
    name: "Posts",
    url: "/dungeon/posts",
    icon: <FontAwesomeIcon icon={faFileText} className="rounded-full" />,
  },
  {
    name: "Images",
    url: "/dungeon/images",
    icon: <FontAwesomeIcon icon={faImage} className="rounded-full" />,
  },
  {
    name: "Users",
    url: "/dungeon/users",
    icon: <FontAwesomeIcon icon={faUsers} className="rounded-full" />,
  },
  {
    name: "Account",
    url: "/dungeon/account",
    icon: <FontAwesomeIcon icon={faUser} className="rounded-full" />,
  },
];
