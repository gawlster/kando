import { Card } from "@prisma/client";
import { ComponentProps, useCallback, useState } from "react";
import InputLabelPair from "../inputLabelPair/inputLabelPair";
import Modal from "../modal/modal";
import styles from "./cardInfoModal.module.css";

export default function CardInfoModal({
  initialData,
  listId,
  ...props
}: Pick<ComponentProps<typeof Modal>, "isOpen" | "onClose"> & {
  initialData: Card;
  listId: string;
}) {
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<Card>(initialData);
  const handleOnChange = useCallback(
    (field: keyof Card) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setData((prev) => ({ ...prev, [field]: e.target.value }));
      },
    []
  );
  const handleSaveChanges = useCallback(async () => {
    setSaving(true);
    await fetch("/api/updateCard", {
      method: "POST",
      body: JSON.stringify({
        listId,
        data,
      }),
    });
    props.onClose?.();
    setSaving(false);
  }, [data, props, listId]);
  const handleCancel = useCallback(() => {
    setData(initialData);
    props.onClose?.();
  }, [initialData, props]);
  return (
    <Modal
      {...props}
      title={data.title}
      wide
      overlayClickClosesModal={false}
      closeButton={false}
      onTitleChange={handleOnChange("title")}
    >
      <InputLabelPair
        id="description"
        label="Description"
        value={data.description || ""}
        onChange={handleOnChange("description")}
      />
      <div className={styles.buttonContainer}>
        <button onClick={handleSaveChanges} disabled={saving}>
          {saving ? "Saving..." : "Save changes"}
        </button>
        <button onClick={handleCancel} disabled={saving}>
          Cancel
        </button>
      </div>
    </Modal>
  );
}
