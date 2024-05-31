"use client";

import { Button } from "@/components/ui/button";
import { SocialNetwork } from "@/data/schema";
import { deleteSocial } from "./actions";

const SocialTable = (socials: any) => {
  return (
    <section className="flex flex-col items-end gap-2">
      {socials.socials.map((social: SocialNetwork) => (
        <div key={social.id} className="flex  gap-2 ">
          <Button asChild variant="link">
            <a target="_blank" rel="noopener" href={social.url!} className="">
              <h2>{social.name}</h2>
            </a>
          </Button>

          <Button
            variant={"destructive"}
            onClick={() => deleteSocial(social.id)}
          >
            Delete
          </Button>
        </div>
      ))}
    </section>
  );
};

export default SocialTable;
