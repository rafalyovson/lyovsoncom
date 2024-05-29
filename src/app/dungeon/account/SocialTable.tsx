"use client";

import { Button } from "@/components/ui/button";
import { SocialNetwork } from "@/data/schema";
import { deleteSocial } from "./actions";

const SocialTable = (socials: any) => {
  return (
    <section className="flex gap-2">
      {socials.socials.map((social: SocialNetwork) => (
        <div key={social.id} className="flex flex-col gap-2">
          <a target="_blank" rel="noopener" href={social.url!} className="">
            <h2>{social.name}</h2>
          </a>

          <Button onClick={() => deleteSocial(social.id)}>Delete</Button>
        </div>
      ))}
    </section>
  );
};

export default SocialTable;
