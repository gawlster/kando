"use client";

import { getDateInDays } from "@/utils/date";
import { useDraggable } from "@dnd-kit/core";
import { type Card } from "@prisma/client";
import { useCallback, useState } from "react";
import CardInfoModal from "../cardInfoModal/cardInfoModal";
import styles from "./card.module.css";

export default function Card({
  data,
  isInDoneList,
  listId,
  beingDragged,
}: {
  data: Card;
  isInDoneList: boolean;
  listId: string;
  beingDragged?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: data.id,
  });
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const isComplete = isInDoneList;
  const isDueSoon = !isInDoneList && new Date(data.endDate) < getDateInDays(2);
  const isOverdue = !isInDoneList && new Date(data.endDate) < getDateInDays(0);

  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);

  const handleOnClick = useCallback(() => {
    setIsInfoModalOpen(true);
  }, []);

  const handleOnCloseInfoModal = useCallback(() => {
    setIsInfoModalOpen(false);
  }, []);
  return (
    <>
      <div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        className={`${styles.card} ${beingDragged ? styles.beingDragged : ""}`}
      >
        <h4>{data.title}</h4>
        <div
          className={`${styles.dates} ${isDueSoon ? styles.dueSoon : ""} ${
            isOverdue ? styles.overdue : ""
          } ${isComplete ? styles.complete : ""}`}
        >
          {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
        </div>
      </div>
      <CardInfoModal
        initialData={data}
        listId={listId}
        isOpen={isInfoModalOpen}
        onClose={handleOnCloseInfoModal}
      />
    </>
  );
}
