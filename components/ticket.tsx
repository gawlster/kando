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
    Chip
} from "@heroui/react";
import { parseDate } from "@internationalized/date";
import {
    forwardRef,
    Key,
    useCallback,
    useRef,
    useState,
} from "react";
import TicketForm from "./ticket-form";
import { type ResponseType as GetTicketsResponse } from "../pages/api/getTickets/[swimlaneId]";
import { Unpacked } from "@/utils/typeUtils";
import { useEnter } from "@/hooks/useEnter";
import { useMoveTicket, useUpdateTicket } from "@/data/tickets";
import { useSwimlanes } from "@/data/swimlanes";

const allUserTags = [] as { id: number, title: string, color: string }[]

type TicketProps = {
    details: Unpacked<GetTicketsResponse>;
    interactionEnabled?: boolean
    ref?: React.Ref<HTMLDivElement>;
    style?: React.CSSProperties;
    listeners?: React.HTMLAttributes<HTMLElement>;
    attributes?: React.HTMLAttributes<HTMLElement>;
};

const Ticket = forwardRef<HTMLDivElement, TicketProps>(({ details, interactionEnabled = true, style, listeners = {}, attributes = {} }, ref) => {
    const { mutateAsync: doUpdateTicket, isPending: saveLoading } = useUpdateTicket(details.swimlaneId || 0);
    const { mutateAsync: doMoveTicket } = useMoveTicket(details.swimlaneId || 0);
    const { data: swimlanes } = useSwimlanes();
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)
    const didLongPress = useRef(false)
    const didCancelPress = useRef(false)
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
        try {
            await doUpdateTicket({
                id: details.id,
                created_at: details.created_at,
                title: editableTitle,
                description: editableDescription,
                startDate: editableStartDate.toString(),
                dueDate: editableDueDate.toString(),
                swimlaneId: details.swimlaneId,
                tagIds: Array.from(editableSelectedTagIds).map((tagId) => Number(tagId))
            })
        } catch (_) {
            // do nothing, handled in the hook
        }
        onDetailsClose();
    }, [
        details,
        editableTitle,
        editableDescription,
        editableStartDate,
        editableDueDate,
        editableSelectedTagIds,
        doUpdateTicket,
        onDetailsClose
    ])
    const onMoveAction = useCallback(async (action: Key) => {
        try {
            await doMoveTicket({
                id: details.id,
                newSwimlaneId: Number(action)
            })
        } catch (_) {
            // do nothing, handled in the hook
        }
        onMoveClose();
    }, [
        details.id,
        doMoveTicket,
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
    useEnter(onDetailsSave, isDetailsOpen);
    const customHandlers = interactionEnabled ? {
        onMouseDown: handleStartPress,
        onTouchStart: handleStartPress,
        onMouseUp: handleEndPress,
        onTouchEnd: handleEndPress,
        onMouseLeave: handleCancelPress,
        onTouchCancel: handleCancelPress,
        onTouchMove: handleCancelPress
    } : {};
    return (
        <>
            <Card
                ref={ref}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                {...(listeners as any)}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                {...(attributes as any)}
                className="w-64 bg-background/70 min-h-20 flex-shrink-0"
                isPressable
                isBlurred
                style={{
                    ...style,
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.45)'
                }}
                {...customHandlers}
            >
                <CardBody className="h-full justify-center w-full">
                    <span className="font-semibold">{details.title}</span>
                    <div className="text-sm text-gray-400">
                        {details.startDate} - {details.dueDate}
                    </div>
                    <div className="flex flex-wrap gap-1 w-full mt-2">
                        {details.tagIds.map((tagId) => (
                            <>
                                {allUserTags?.map((tag) => {
                                    if (`${tag.id}` === tagId) {
                                        return (
                                            <Chip
                                                key={tagId}
                                                style={{ backgroundColor: tag.color }}
                                                radius="sm"
                                            >
                                                {tag.title}
                                            </Chip>
                                        )
                                    }
                                })}
                            </>
                        ))}
                    </div>
                </CardBody>
            </Card>
            <Modal isOpen={isDetailsOpen} onClose={onDetailsClose} isDismissable={false}>
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
                        <Button variant="ghost" onPress={handleCloseDetails} disabled={saveLoading}>
                            Close
                        </Button>
                        <Button onPress={onDetailsSave} isLoading={saveLoading}>
                            {saveLoading ? "Loading..." : "Save"}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Modal isOpen={isMoveOpen} onClose={onMoveClose} isDismissable={false}>
                <ModalContent>
                    <ModalHeader>Move Ticket</ModalHeader>
                    <ModalBody>
                        <Listbox onAction={onMoveAction}>
                            {swimlanes ? swimlanes.map((swimlane) => {
                                if (swimlane.id === details.swimlaneId) {
                                    return null;
                                }
                                return (
                                    <ListboxItem key={swimlane.id}>
                                        {swimlane.title}
                                    </ListboxItem>
                                )
                            }) : null}
                        </Listbox>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" onPress={onMoveClose} disabled={false}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
})

Ticket.displayName = "Ticket";

export default Ticket;
