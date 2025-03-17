import fs from "fs/promises";
import path from "path";

export type Tag = {
  id: string;
  name: string;
  color: string;
};

export type Comment = {
  id: string;
  text: string;
};

export type ChecklistItem = {
  id: string;
  text: string;
  isCompleted: boolean;
};

export type Card = {
  id: string;
  title: string;
  description: string;
  tags: Tag[];
  startDate: string;
  endDate: string;
  comments: Comment[];
  checklistItems: ChecklistItem[];
};

export type List = {
  id: string;
  title: string;
  cards: Card[];
};

type Data = List[];

export async function getData(): Promise<Data> {
  const filePath = path.join(process.cwd(), "src/data.json");
  const fileContents = await fs.readFile(filePath, "utf8");
  const data = JSON.parse(fileContents);
  return data;
}
