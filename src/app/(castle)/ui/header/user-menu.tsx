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

export const Menu = ({ user }: { user: any }) => {
  const { id, name, bio, socials, menu } = user;
  return (
    <SheetContent
      className="flex flex-col gap-4 w-full lg:w-[300px]"
      side={id === "jess" ? "left" : "right"}
    >
      <SheetHeader>
        <Card className="w-[250px] mx-auto">
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
            <section className="flex gap-2 justify-between w-full">
              {socials.map((social: any) => (
                <Button
                  className=" "
                  size={"icon"}
                  variant={"ghost"}
                  key={social.name}
                  asChild
                >
                  <a
                    title={`Visit ${name}'s ${social.name} page.`}
                    href={social.url}
                    target="_blank"
                    rel="noopener"
                  >
                    <FontAwesomeIcon icon={social.icon} className="w-8 h-8 " />
                  </a>
                </Button>
              ))}
            </section>
          </CardFooter>
        </Card>
      </SheetHeader>

      <section className="flex flex-col gap-2">
        {menu.map((menuItem: any) => (
          <Button variant={"link"} key={menuItem.name} asChild>
            <Link
              className="hover:underline flex gap-2 text-lg"
              href={menuItem.url}
            >
              {menuItem.name}
            </Link>
          </Button>
        ))}
      </section>
    </SheetContent>
  );
};
