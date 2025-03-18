"use client";

import { useCallback, useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Card from "../card/card";
import { DragContext } from "../listsContainer/listsContainer";
import styles from "./draggingCard.module.css";

export default function DraggingCard() {
  const { dragData, setDragData } = useContext(DragContext);
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const handleMouseMove = useCallback((e: MouseEvent) => {
    setPosition({
      x: e.clientX,
      y: e.clientY,
    });
  }, []);
  const handleMouseUp = useCallback(() => {
    // Need to find out what position and what list it was dropped in and then make a request to move the card there
    setDragData(null);
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  }, [handleMouseMove, setDragData]);
  useEffect(() => {
    if (dragData) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragData, handleMouseMove, handleMouseUp]);
  if (!dragData) {
    return null;
  }
  return createPortal(
    <div
      className={styles.draggingCard}
      style={{
        top: position.y,
        left: position.x,
      }}
    >
      <Card
        data={dragData.card}
        isInDoneList={dragData.listId === "done"}
        listId={dragData.listId}
        beingDragged
      />
    </div>,
    document.body
  );
}
