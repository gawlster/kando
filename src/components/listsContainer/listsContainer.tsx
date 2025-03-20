"use client";

import { DndContext } from "@dnd-kit/core";
import { type User } from "@prisma/client";
import { useCallback } from "react";
import styles from "../../app/page.module.css";
import List from "../list/list";

export default function ListsContainer({ user }: { user: User | null }) {
  const handleDragEnd = useCallback(() => {
    console.log("drag end");
  }, []);
  return (
    <DndContext onDragEnd={handleDragEnd}>
      {!!user ? (
        <div className={styles.listsContainer}>
          {user?.lists.map((list) => (
            <List key={list.id} data={list} />
          ))}
        </div>
      ) : (
        <List data={{ id: "loading", title: "", cards: [] }} />
      )}
    </DndContext>
  );
}
