"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./modal.module.css";

export default function Modal({
  children,
  isOpen,
  onClose = () => {},
  title,
  wide = false,
  overlayClickClosesModal = true,
  closeButton = true,
  onTitleChange,
}: {
  children: React.ReactNode;
  isOpen: boolean;
  onClose?: () => void;
  title: string;
  wide?: boolean;
  overlayClickClosesModal?: boolean;
  closeButton?: boolean;
  onTitleChange?: React.ChangeEventHandler;
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
      onClick={overlayClickClosesModal ? onClose : undefined}
    >
      <div
        className={`${styles.modal} ${isHidden ? styles.hiddenModal : ""} ${
          wide ? styles.wide : ""
        }`}
        onClick={handleModalClick}
      >
        <div className={styles.header}>
          {onTitleChange ? (
            <input
              className={styles.editableTitle}
              type="text"
              value={title}
              onChange={onTitleChange}
              placeholder="Title"
            />
          ) : (
            <h2>{title}</h2>
          )}
          {closeButton && (
            <button className={styles.closeButton} onClick={onClose}>
              X
            </button>
          )}
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
}
