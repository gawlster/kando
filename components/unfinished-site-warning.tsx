import { useDisclosure } from "@heroui/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Button,
    Checkbox
} from "@heroui/react";

export default function UnfinishedSiteWarning() {
    const message = useMemo(() => (
        "This site is still under development. It is intended to be used as a demo only. Some features may not work as intended. DO NOT INPUT ANY SENSITIVE INFORMATION OR PERSONAL DATA."
    ), []);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [dontShowAgainChecked, setDontShowAgainChecked] = useState(false);
    const hasWarnedThisVisit = useRef(false);
    useEffect(() => {
        if (!hasWarnedThisVisit.current) {
            hasWarnedThisVisit.current = true;
            if (!document.cookie.includes('dontShowUnfinishedSiteWarning=true')) {
                onOpen();
            }
        }
    }, [onOpen]);
    const handleClose = useCallback(() => {
        if (dontShowAgainChecked) {
            document.cookie = "dontShowUnfinishedSiteWarning=true; path=/; max-age=31536000; SameSite=Lax";
        }
        onClose();
    }, [dontShowAgainChecked, onClose]);
    return (
        <Modal isOpen={isOpen} onClose={onClose} isDismissable={false}>
            <ModalContent>
                <ModalHeader>WARNING!</ModalHeader>
                <ModalBody>
                    <p className="mb-4">{message}</p>
                    <div className="flex gap-2 wrap">
                        <Checkbox
                            checked={dontShowAgainChecked}
                            onChange={(e) => setDontShowAgainChecked(e.target.checked)}
                        />
                        <p>Don{"'"}t warn me again</p>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button onPress={handleClose} color="danger">
                        I Understand
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

