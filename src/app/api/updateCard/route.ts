import { getUser, updateUser } from "@/utils/data";

export async function POST(request: Request) {
  const json = await request.json();
  const { listId, data } = json;
  console.log(listId);
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
          cards: list.cards.map((card) => {
            if (card.id === data.id) {
              return data;
            }
            return card;
          }),
        };
      }
      return list;
    }),
  };
  await updateUser(user.id, newUserData);
  return Response.json({ success: true });
}
