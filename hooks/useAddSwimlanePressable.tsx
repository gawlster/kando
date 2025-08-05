import { Button } from "@heroui/button";
import { Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@heroui/react";
import { useCallback, useState } from "react";
import { useEnter } from "@/hooks/useEnter";
import { useAddSwimlane } from "@/data/swimlanes";

export default function useAddSwimlanePressable() {
    const { mutateAsync: doAddSwimlane, isPending: loading } = useAddSwimlane();
    const [title, setTitle] = useState("");
    const { isOpen, onOpen, onClose } = useDisclosure();
    const handleSubmit = useCallback(async () => {
        try {
            await doAddSwimlane({
                title,
            })
        } catch (_) {
            // do nothing, handled in the hook
        }
        setTitle("");
        onClose();
    }, [
        doAddSwimlane,
        title,
        onClose
    ]);
    useEnter(handleSubmit, isOpen);
    return {
        onPress: onOpen,
        modal: (
            <Modal isOpen={isOpen} onClose={onClose} isDismissable={!loading}>
                <ModalContent>
                    <ModalHeader>Add Swimlane</ModalHeader>
                    <ModalBody>
                        <Input
                            label="Title"
                            labelPlacement="inside"
                            name="title"
                            value={title}
                            onValueChange={setTitle}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" onPress={onClose} disabled={loading}>
                            Cancel
                        </Button>
                        <Button onPress={handleSubmit} isLoading={loading}>
                            {loading ? "Loading..." : "Add"}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        )
    }
}
