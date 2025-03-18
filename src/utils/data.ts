import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

export async function getUser() {
  return await prisma.user.findFirst();
}

export async function updateUser(id: string, user: Omit<User, "id">) {
  return await prisma.user.update({
    where: { id },
    data: user,
  });
}
