import { ComponentProps } from "react";
import Modal from "../modal/modal";
import modalStyles from "../modal/modal.module.css";

export default function ConfirmCancelModal({
  onYes,
  onNo,
  ...props
}: Pick<ComponentProps<typeof Modal>, "isOpen" | "onClose"> & {
  onYes: () => void;
  onNo: () => void;
}) {
  return (
    <Modal {...props} title="Are you sure?">
      <p>Are you sure you want to cancel? All unsaved changes will be lost</p>
      <div className={modalStyles.buttonContainer}>
        <button onClick={onNo}>No</button>
        <button onClick={onYes}>Yes</button>
      </div>
    </Modal>
  );
}
