import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const ContentForm = ({ value }: { value?: string }) => {
  return (
    <section className="flex flex-col gap-4">
      <Label htmlFor="content">Content:</Label>
      <Textarea name="content" required defaultValue={value} />
    </section>
  );
};

export default ContentForm;
