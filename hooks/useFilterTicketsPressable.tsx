import { Checkbox, CheckboxGroup, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from "@heroui/react";
import { useCallback } from "react";
import { useAllUserTags } from "@/data/tags";
import { useTagFilters } from "@/hooks/useTagFilters";

export default function useFilterTicketsPressable() {
    const { data: allUserTags } = useAllUserTags();
    const { tagFilters, setTagFilters } = useTagFilters();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const onPress = useCallback(() => {
        onOpen();
    }, []);
    return {
        onPress,
        modal: (
            <Modal isOpen={isOpen} onClose={onClose} isDismissable>
                <ModalContent>
                    <ModalHeader>Add Swimlane</ModalHeader>
                    <ModalBody>
                        <CheckboxGroup value={tagFilters.split(",")} onValueChange={(values) => setTagFilters(values.join(","))}>
                            {allUserTags?.map((tag) => (
                                <Checkbox
                                    key={tag.id}
                                    value={tag.id.toString()}
                                >
                                    {tag.title}
                                </Checkbox>
                            ))}
                        </CheckboxGroup>
                    </ModalBody>
                </ModalContent>
            </Modal>
        ),
    }
}
