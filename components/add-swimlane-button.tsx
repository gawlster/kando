import { usePost } from "@/hooks/usePost";
import { Button } from "@heroui/button";
import { Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@heroui/react";
import { useCallback, useContext, useState } from "react";
import {
    type BodyType as AddSwimlaneBody,
    type ResponseType as AddSwimlaneResponse,
    url
} from "../pages/api/addSwimlane";
import { RefetchDataFunctionsContext } from "@/pages";
import { useEnter } from "@/hooks/useEnter";

export default function AddSwimlaneButton() {
    const { refetchAllSwimlanes } = useContext(RefetchDataFunctionsContext);
    const [title, setTitle] = useState("");
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { doPost, loading } = usePost<AddSwimlaneBody, AddSwimlaneResponse>(url);
    const handleSubmit = useCallback(async () => {
        await doPost({
            title,
        })
        await refetchAllSwimlanes();
        setTitle("");
        onClose();
    }, [doPost, refetchAllSwimlanes, title, onClose]);
    useEnter(handleSubmit, isOpen);
    return (
        <>
            <Button onPress={onOpen}>
                Add Swimlane
            </Button>
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
        </>
    )
}
