import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/db";

const session = await auth();
const { id } = await prisma.user.findUnique({
  where: {
    email: session.user.email,
  },
});
export default id;
