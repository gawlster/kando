import { getUser, updateUser } from "@/utils/data";
import { getDateInDays } from "@/utils/date";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  const json = await request.json();
  const { title, description, listId } = json;
  if (!title || !listId) {
    return Response.json(
      { success: false, error: "Missing required fields" },
      { status: 400 }
    );
  }

  const user = await getUser();
  if (!user) {
    return Response.json(
      { success: false, error: "User not found" },
      { status: 404 }
    );
  }
  const newUserData = {
    lists: user.lists.map((list) => {
      if (list.id === listId) {
        return {
          ...list,
          cards: [
            ...list.cards,
            {
              id: Math.random().toString(),
              title,
              description,
              startDate: new Date(),
              endDate: getDateInDays(1),
              tags: [],
              comments: [],
              checklistItems: [],
            },
          ],
        };
      }
      return list;
    }),
  };
  await updateUser(user.id, newUserData);
  revalidatePath("/"); // TODO: Not working

  return Response.json({ success: true });
}
