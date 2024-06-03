import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ImageForm = ({
  form,
  formAction,
  isPending,
}: {
  form: any;
  formAction: (payload: FormData) => void;
  isPending: boolean;
}) => {
  return (
    <form action={formAction}>
      <section className="  w-full space-y-6">
        <section className="flex flex-col gap-2">
          <Label>Name</Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={`featured_image_for_${form.getValues("slug")}`}
            required
          />
        </section>

        <section className="flex flex-col gap-2">
          <Label>Choose File</Label>
          <Input type="file" id="image" name="image" required />
        </section>
        <Button className="w-full" type="submit" disabled={isPending}>
          Upload
        </Button>
      </section>
    </form>
  );
};

export default ImageForm;
