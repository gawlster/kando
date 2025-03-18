"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./modal.module.css";

export default function Modal({
  children,
  isOpen,
  onClose = () => {},
  title,
}: {
  children: React.ReactNode;
  isOpen: boolean;
  onClose?: () => void;
  title: string;
}) {
  const [isMounted, setIsMounted] = useState(false);
  const [isHidden, setIsHidden] = useState(!isOpen);
  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      setTimeout(() => {
        setIsHidden(false);
      }, 5);
    } else {
      setIsHidden(true);
      setTimeout(() => {
        setIsMounted(false);
      }, 200);
    }
    return () => {
      setIsMounted(false);
    };
  }, [isOpen]);
  const handleModalClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);
  if (!isMounted) {
    return null;
  }
  return createPortal(
    <div
      className={`${styles.overlay} ${isHidden ? styles.hidden : ""}`}
      onClick={onClose}
    >
      <div
        className={`${styles.modal} ${isHidden ? styles.hiddenModal : ""}`}
        onClick={handleModalClick}
      >
        <div className={styles.header}>
          <h2>{title}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            X
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
}
