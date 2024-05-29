import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";

const Menu = ({ user }: { user: any }) => {
  const { id, name, bio, socials, menu } = user;
  return (
    <SheetContent
      className="flex flex-col gap-4 "
      side={id === "jess" ? "left" : "right"}
    >
      <SheetHeader>
        <Card>
          <CardHeader>
            <Image
              alt={id}
              src={`/${id.toLowerCase()}.png`}
              width={300}
              height={400}
            />
          </CardHeader>
          <CardContent>
            <Link className="hover:underline" href={`/${id}`}>
              <SheetTitle>{name}</SheetTitle>
            </Link>

            <SheetDescription>{bio}</SheetDescription>
          </CardContent>
          <CardFooter>
            <section className="flex gap-2">
              {socials.map((social: any) => (
                <a
                  className=""
                  title={`Visit ${name}'s ${social.name} page.`}
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener"
                >
                  <FontAwesomeIcon icon={social.icon} className="w-8 h-8 " />
                </a>
              ))}
            </section>
          </CardFooter>
        </Card>
      </SheetHeader>

      <section className="flex flex-col gap-2 items-start">
        {menu.map((menuItem: any) => (
          <Button variant={"link"} key={menuItem.name} asChild>
            <Link className="hover:underline flex gap-2" href={menuItem.url}>
              <FontAwesomeIcon icon={menuItem.icon} className="w-8 h-8 " />
              <span>{menuItem.name}</span>
            </Link>
          </Button>
        ))}
      </section>
    </SheetContent>
  );
};

export default Menu;
