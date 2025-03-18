"use client";

import { ComponentProps, useCallback, useState } from "react";
import InputLabelPair from "../inputLabelPair/inputLabelPair";
import Modal from "../modal/modal";

type FormInputs = {
  title: string;
  description: string;
};

export default function AddCardModal({
  listToAddTo,
  ...props
}: Pick<ComponentProps<typeof Modal>, "isOpen" | "onClose"> & {
  listToAddTo: string;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [formInputs, setFormInputs] = useState<FormInputs>({
    title: "",
    description: "",
  });
  const handleChange = useCallback(
    (field: keyof FormInputs) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormInputs((prev) => ({ ...prev, [field]: e.target.value }));
    },
    []
  );
  const handleSubmit = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      setSubmitting(true);
      e.preventDefault();
      await fetch("/api/addCard", {
        method: "POST",
        body: JSON.stringify({
          title: formInputs.title,
          description: formInputs.description,
          listId: listToAddTo,
        }),
      });
      setFormInputs({ title: "", description: "" });
      props.onClose?.();
      setSubmitting(false);
    },
    [formInputs, listToAddTo, props]
  );
  return (
    <Modal {...props} title="Add a card">
      <form>
        <InputLabelPair
          id="title"
          label="Title"
          value={formInputs.title}
          onChange={handleChange("title")}
        />
        <InputLabelPair
          id="description"
          label="Description (optional)"
          value={formInputs.description}
          onChange={handleChange("description")}
        />
        <button onClick={handleSubmit}>
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </Modal>
  );
}
