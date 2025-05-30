import { Database } from "@/database/supabase";
import { usePost } from "@/hooks/usePost";
import { AvailableSwimlanesContext, RefetchDataFunctionsContext } from "@/pages";
import {
    Button,
    Card,
    CardBody,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Listbox,
    ListboxItem,
    useDisclosure,
} from "@heroui/react";
import { parseDate } from "@internationalized/date";
import {
    Key,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import { useContext } from "react";
import {
    type BodyType as UpdateTicketBody,
    type ResponseType as UpdateTicketResponse,
    url as updateTicketUrl
} from "../pages/api/updateTicket";
import {
    type BodyType as MoveTicketBody,
    type ResponseType as MoveTicketResponse,
    url as moveTicketUrl
} from "../pages/api/moveTicket";
import TicketForm from "./ticket-form";
import { type ResponseType as GetTicketsResponse } from "../pages/api/getTickets/[swimlaneId]";
import { Unpacked } from "@/utils/typeUtils";
import { useEnter } from "@/hooks/useEnter";

export default function Ticket({ details }: { details: Unpacked<GetTicketsResponse>; }) {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)
    const didLongPress = useRef(false)
    const didCancelPress = useRef(false)
    const { refetchSwimlane } = useContext(RefetchDataFunctionsContext)
    const {
        doPost: updateTicketPost,
        loading: updateLoading,
    } = usePost<UpdateTicketBody, UpdateTicketResponse>(updateTicketUrl)
    const {
        doPost: moveTicketPost,
        loading: moveLoading,
    } = usePost<MoveTicketBody, MoveTicketResponse>(moveTicketUrl)
    const { swimlanes: availableSwimlanes } = useContext(AvailableSwimlanesContext)
    const [editableTitle, setEditableTitle] = useState(details.title)
    const [editableDescription, setEditableDescription] = useState(details.description)
    const [editableStartDate, setEditableStartDate] = useState(parseDate(details.startDate))
    const [editableDueDate, setEditableDueDate] = useState(parseDate(details.dueDate))
    const [editableSelectedTagIds, setEditableSelectedTagIds] = useState<Set<string>>(new Set(details.tagIds));
    const { isOpen: isDetailsOpen, onOpen: onDetailsOpen, onClose: onDetailsClose } = useDisclosure();
    const { isOpen: isMoveOpen, onOpen: onMoveOpen, onClose: onMoveClose } = useDisclosure();
    const handleStartPress = useCallback(() => {
        didCancelPress.current = false
        timeoutRef.current = setTimeout(() => {
            didLongPress.current = true
            onMoveOpen()
        }, 500)
    }, [onMoveOpen])
    const handleCancelPress = useCallback(() => {
        didCancelPress.current = true
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
            timeoutRef.current = null
        }
        if (didLongPress.current) {
            didLongPress.current = false
            return true
        }
        return false
    }, [])
    const handleEndPress = useCallback(() => {
        const cancelled = didCancelPress.current
        const didLongPress = handleCancelPress()
        if (didLongPress || cancelled) {
            return
        }
        onDetailsOpen()
    }, [onDetailsOpen, handleCancelPress])
    const onDetailsSave = useCallback(async () => {
        await updateTicketPost({
            id: details.id,
            created_at: details.created_at,
            title: editableTitle,
            description: editableDescription,
            startDate: editableStartDate.toString(),
            dueDate: editableDueDate.toString(),
            swimlaneId: details.swimlaneId,
            tagIds: Array.from(editableSelectedTagIds).map((tagId) => Number(tagId))
        })
        if (details?.swimlaneId) {
            await refetchSwimlane(details.swimlaneId)
        }
        onDetailsClose();
    }, [
        details,
        editableTitle,
        editableDescription,
        editableStartDate,
        editableDueDate,
        editableSelectedTagIds,
        updateTicketPost,
        refetchSwimlane,
        onDetailsClose
    ])
    const onMoveAction = useCallback(async (action: Key) => {
        await moveTicketPost({
            id: details.id,
            newSwimlaneId: Number(action)
        })
        if (details?.swimlaneId) {
            await refetchSwimlane(details.swimlaneId)
        }
        if (!isNaN(Number(action))) {
            await refetchSwimlane(Number(action));
        }
        onMoveClose();
    }, [
        details,
        moveTicketPost,
        refetchSwimlane,
        onMoveClose
    ]);
    const handleCloseDetails = useCallback(() => {
        setEditableTitle(details.title);
        setEditableDescription(details.description);
        setEditableStartDate(parseDate(details.startDate));
        setEditableDueDate(parseDate(details.dueDate));
        setEditableSelectedTagIds(new Set(details.tagIds));
        onDetailsClose();
    }, [
        details,
        onDetailsClose,
        setEditableTitle,
        setEditableDescription,
        setEditableStartDate,
        setEditableDueDate,
        setEditableSelectedTagIds
    ]);
    const { enable, disable } = useEnter(onDetailsSave);
    useEffect(() => {
        if (isDetailsOpen) {
            enable();
        } else {
            disable();
        }
    }, [isDetailsOpen, enable, disable]);
    return (
        <>
            <Card
                className="w-64 bg-background/70 h-20 min-h-20"
                isPressable
                isBlurred
                style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.45)' }}
                onMouseDown={handleStartPress}
                onTouchStart={handleStartPress}
                onMouseUp={handleEndPress}
                onTouchEnd={handleEndPress}
                onMouseLeave={handleCancelPress}
                onTouchCancel={handleCancelPress}
                onTouchMove={handleCancelPress}
            >
                <CardBody className="h-full justify-center">
                    <span className="font-semibold">{details.title}</span>
                    <span>Card body: TODO</span>
                </CardBody>
            </Card>
            <Modal isOpen={isDetailsOpen} onClose={onDetailsClose} isDismissable={!updateLoading}>
                <ModalContent>
                    <ModalHeader>Ticket Details</ModalHeader>
                    <ModalBody>
                        <TicketForm
                            title={editableTitle}
                            setTitle={setEditableTitle}
                            description={editableDescription}
                            setDescription={setEditableDescription}
                            startDate={editableStartDate}
                            handleStartDateChange={setEditableStartDate}
                            dueDate={editableDueDate}
                            setDueDate={setEditableDueDate}
                            selectedTagIds={editableSelectedTagIds}
                            setSelectedTagIds={setEditableSelectedTagIds}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" onPress={handleCloseDetails} disabled={updateLoading}>
                            Close
                        </Button>
                        <Button onPress={onDetailsSave} isLoading={updateLoading}>
                            {updateLoading ? "Loading..." : "Save"}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Modal isOpen={isMoveOpen} onClose={onMoveClose} isDismissable={!moveLoading}>
                <ModalContent>
                    <ModalHeader>Move Ticket</ModalHeader>
                    <ModalBody>
                        <Listbox onAction={onMoveAction}>
                            {availableSwimlanes.map((swimlane) => {
                                if (swimlane.id === details.swimlaneId) {
                                    return null;
                                }
                                return (
                                    <ListboxItem key={swimlane.id}>
                                        {swimlane.title}
                                    </ListboxItem>
                                )
                            })}
                        </Listbox>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" onPress={onMoveClose} disabled={moveLoading}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}
