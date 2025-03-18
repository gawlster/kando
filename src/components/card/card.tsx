"use client";

import { getDateInDays } from "@/utils/date";
import { isWithinRange } from "@/utils/misc";
import { type Card } from "@prisma/client";
import { useCallback, useContext, useRef, useState } from "react";
import CardInfoModal from "../cardInfoModal/cardInfoModal";
import { DragContext } from "../listsContainer/listsContainer";
import styles from "./card.module.css";

type MouseInfo = {
  x: number;
  y: number;
  mouseDownTime: number;
  isDragging: boolean;
} | null;

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
  const rootElement = useRef<HTMLDivElement | null>(null);
  const { setDragData } = useContext(DragContext);
  const [mouseInfo, setMouseInfo] = useState<MouseInfo>(null);
  const dragStartTimer = useRef<NodeJS.Timeout | null>(null);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const isComplete = isInDoneList;
  const isDueSoon = !isInDoneList && new Date(data.endDate) < getDateInDays(2);
  const isOverdue = !isInDoneList && new Date(data.endDate) < getDateInDays(0);

  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);

  const handleOnClick = useCallback(() => {
    setIsInfoModalOpen(true);
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) {
        return;
      }
      e.preventDefault();
      setMouseInfo({
        x: e.clientX,
        y: e.clientY,
        mouseDownTime: Date.now(),
        isDragging: false,
      });
      dragStartTimer.current = setTimeout(() => {
        setMouseInfo((prev) => (prev ? { ...prev, isDragging: true } : null));
        const { x, y } = rootElement.current?.getBoundingClientRect() ?? {
          x: 0,
          y: 0,
        };
        setDragData({
          card: data,
          listId,
          startingPosition: { x, y },
        });
      }, 200);
    },
    [data, listId, setDragData]
  );

  const handleMouseUp = useCallback(
    (e: React.MouseEvent) => {
      if (
        mouseInfo &&
        !mouseInfo.isDragging &&
        Date.now() - mouseInfo.mouseDownTime < 200 &&
        isWithinRange(mouseInfo.x, e.clientX, 5) &&
        isWithinRange(mouseInfo.y, e.clientY, 5)
      ) {
        handleOnClick();
        if (dragStartTimer.current) {
          clearTimeout(dragStartTimer.current);
          dragStartTimer.current = null;
        }
      }
    },
    [handleOnClick, mouseInfo]
  );

  const handleMouseLeave = useCallback(() => {
    setMouseInfo(null);
    if (dragStartTimer.current) {
      clearTimeout(dragStartTimer.current);
      dragStartTimer.current = null;
    }
  }, []);

  const handleOnCloseInfoModal = useCallback(() => {
    setIsInfoModalOpen(false);
  }, []);
  return (
    <>
      <div
        ref={rootElement}
        className={`${styles.card} ${beingDragged ? styles.beingDragged : ""}`}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
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
