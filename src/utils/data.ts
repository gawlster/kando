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

export async function bootstrap() {
  await prisma.user.deleteMany();
  await prisma.user.create({
    data: {
      id: "1",
      lists: [
        {
          id: "backlog",
          title: "Backlog",
          cards: [],
        },
        {
          id: "this-week",
          title: "This Week",
          cards: [],
        },
        {
          id: "doing",
          title: "Doing",
          cards: [],
        },
        {
          id: "done",
          title: "Done",
          cards: [],
        },
      ],
    },
  });
}
