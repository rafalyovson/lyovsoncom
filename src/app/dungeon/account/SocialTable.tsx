"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SocialNetwork } from "@/data/schema";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import CreateSocialForm from "./CreateSocialForm";
import DeleteSocial from "./DeleteSocial";

const SocialTable = (socials: any) => {
  const [isCreatingSocial, setIsCreatingSocial] = useState(false);
  const [isDeletingSocial, setIsDeletingSocial] = useState(false);
  const [sn, setSn] = useState("");

  return (
    <Card className="flex-grow">
      <CardHeader className="px-7">
        <CardTitle>Social Networks</CardTitle>
        <CardDescription>Your social networks.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 items-end">
        {socials.socials.map((social: SocialNetwork) => (
          <section
            key={social.id}
            className="flex border-b w-full justify-end "
          >
            <Button asChild variant="link">
              <a target="_blank" rel="noopener" href={social.url!} className="">
                <h2>{social.name}</h2>
              </a>
            </Button>

            <Button
              variant="ghost"
              onClick={() => {
                setSn(social.id);
                setIsDeletingSocial(true);
              }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <DeleteSocial
              id={sn}
              isOpen={isDeletingSocial}
              setIsOpen={setIsDeletingSocial}
            />
          </section>
        ))}
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          variant="default"
          onClick={() => setIsCreatingSocial(true)}
        >
          Add Social
        </Button>
        <CreateSocialForm
          isOpen={isCreatingSocial}
          setIsOpen={setIsCreatingSocial}
        />
      </CardFooter>
    </Card>
  );
};

export default SocialTable;
