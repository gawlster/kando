"use client";

import { Card, type User } from "@prisma/client";
import { createContext, useState } from "react";
import styles from "../../app/page.module.css";
import DraggingCard from "../draggingCard/draggingCard";
import List from "../list/list";

export type DragData = {
  card: Card;
  listId: string;
  startingPosition: { x: number; y: number };
} | null;

export const DragContext = createContext<{
  dragData: DragData;
  setDragData: (data: DragData) => void;
}>({
  dragData: null,
  setDragData: () => {},
});

export default function ListsContainer({ user }: { user: User | null }) {
  const [dragData, setDragData] = useState<DragData>(null);
  return (
    <DragContext.Provider
      value={{
        dragData,
        setDragData,
      }}
    >
      {!!user ? (
        <div className={styles.listsContainer}>
          {user?.lists.map((list) => (
            <List key={list.id} data={list} />
          ))}
        </div>
      ) : (
        <List data={{ id: "loading", title: "", cards: [] }} />
      )}
      <DraggingCard />
    </DragContext.Provider>
  );
}
