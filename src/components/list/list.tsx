"use client";

import { type List } from "@prisma/client";
import { useCallback, useState } from "react";
import AddCardModal from "../addCardModal/addCardModal";
import Card from "../card/card";
import styles from "./list.module.css";

export default function List({ data }: { data: List }) {
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
  const handleAddCardClick = useCallback(() => {
    setIsAddCardModalOpen(true);
  }, []);
  const handleCloseAddCardModal = useCallback(() => {
    setIsAddCardModalOpen(false);
  }, []);

  return (
    <>
      <div className={styles.list}>
        <div className={styles.header}>
          <h3>{data.title}</h3>
          <button className={styles.addButton} onClick={handleAddCardClick}>
            +
          </button>
        </div>
        <div className={styles.container}>
          {data.cards.map((card) => (
            <Card
              key={card.id}
              data={card}
              isInDoneList={data.id === "done"}
              listId={data.id}
            />
          ))}
        </div>
      </div>
      <AddCardModal
        isOpen={isAddCardModalOpen}
        onClose={handleCloseAddCardModal}
        listToAddTo={data.id}
      />
    </>
  );
}
