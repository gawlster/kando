import { Card } from "@prisma/client";
import { ComponentProps, useCallback, useRef, useState } from "react";
import ConfirmCancelModal from "../confirmCancelModal/confirmCancelModal";
import InputLabelPair from "../inputLabelPair/inputLabelPair";
import Modal from "../modal/modal";
import modalStyles from "../modal/modal.module.css";

export default function CardInfoModal({
  initialData,
  listId,
  ...props
}: Pick<ComponentProps<typeof Modal>, "isOpen" | "onClose"> & {
  initialData: Card;
  listId: string;
}) {
  const hasMadeChanges = useRef(false);
  const [confirmCancelModalOpen, setConfirmCancelModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<Card>(initialData);
  const handleOnChange = useCallback(
    (field: keyof Card) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setData((prev) => ({ ...prev, [field]: e.target.value }));
        hasMadeChanges.current = true;
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
    hasMadeChanges.current = false;
    setSaving(false);
  }, [data, props, listId]);
  const handleCancel = useCallback(() => {
    if (hasMadeChanges.current) {
      setConfirmCancelModalOpen(true);
    } else {
      props.onClose?.();
    }
  }, [props]);
  const cancelConfirm = useCallback(() => {
    setConfirmCancelModalOpen(false);
    setData(initialData);
    hasMadeChanges.current = false;
    props.onClose?.();
  }, [initialData, props]);
  const cancelAbort = useCallback(() => {
    setConfirmCancelModalOpen(false);
  }, []);
  return (
    <>
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
        <div className={modalStyles.buttonContainer}>
          <button onClick={handleCancel} disabled={saving}>
            Cancel
          </button>
          <button onClick={handleSaveChanges} disabled={saving}>
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </Modal>
      <ConfirmCancelModal
        isOpen={confirmCancelModalOpen}
        onYes={cancelConfirm}
        onNo={cancelAbort}
        onClose={cancelAbort}
      />
    </>
  );
}
