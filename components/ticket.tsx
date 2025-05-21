import { Database } from "@/database/supabase";
import { usePost } from "@/hooks/usePost";
import { AvailableSwimlanesContext, RefetchDataFunctionsContext } from "@/pages";
import {
    Button,
    Card,
    CardBody,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
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

type Ticket = Database["public"]["Tables"]["ticket"]["Row"]

export default function Ticket({ details }: { details: Ticket; }) {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)
    const [refetchFunctions, _] = useContext(RefetchDataFunctionsContext)
    const {
        doPost: updateTicketPost,
        loading: updateLoading,
        error: updateError
    } = usePost<UpdateTicketBody, UpdateTicketResponse>(updateTicketUrl)
    const {
        doPost: moveTicketPost,
        loading: moveLoading,
        error: moveError
    } = usePost<MoveTicketBody, MoveTicketResponse>(moveTicketUrl)
    const { swimlanes: availableSwimlanes } = useContext(AvailableSwimlanesContext)
    const [editableTitle, setEditableTitle] = useState(details.title)
    const [editableDescription, setEditableDescription] = useState(details.description)
    const [editableStartDate, setEditableStartDate] = useState(parseDate(details.startDate))
    const [editableDueDate, setEditableDueDate] = useState(parseDate(details.dueDate))
    const { isOpen: isDetailsOpen, onOpen: onDetailsOpen, onClose: onDetailsClose } = useDisclosure();
    const { isOpen: isMoveOpen, onOpen: onMoveOpen, onClose: onMoveClose } = useDisclosure();
    const handleStartPress = useCallback(() => {
        timeoutRef.current = setTimeout(() => {
            onMoveOpen()
        }, 500)
    }, [onMoveOpen])
    const handleCancelPress = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
            timeoutRef.current = null
        }
    }, [])
    const handleEndPress = useCallback(() => {
        handleCancelPress()
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
        })
        if (details?.swimlaneId && details.swimlaneId in refetchFunctions) {
            const refetchSwimlane = refetchFunctions[details.swimlaneId]
            await refetchSwimlane()
        }
        onDetailsClose();
    }, [
        details,
        editableTitle,
        editableDescription,
        editableStartDate,
        editableDueDate,
        refetchFunctions,
        updateTicketPost,
        onDetailsClose
    ])
    const onMoveAction = useCallback(async (action: Key) => {
        await moveTicketPost({
            id: details.id,
            newSwimlaneId: Number(action)
        })
        if (details?.swimlaneId && details.swimlaneId in refetchFunctions) {
            const refetchSwimlane = refetchFunctions[details.swimlaneId]
            await refetchSwimlane()
        }
        if (Number(action) in refetchFunctions) {
            const refetchSwimlane = refetchFunctions[Number(action)]
            await refetchSwimlane()
        }
        onMoveClose();
    }, [
        details,
        moveTicketPost,
        refetchFunctions,
        onMoveClose
    ]);

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
            >
                <CardBody className="h-full justify-center">
                    <span className="font-semibold">{details.title}</span>
                    <span>Card body: TODO</span>
                </CardBody>
            </Card>
            <Modal isOpen={isDetailsOpen} onClose={onDetailsClose}>
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
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" onPress={onDetailsClose}>
                            Close
                        </Button>
                        <Button onPress={onDetailsSave}>
                            Save
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Modal isOpen={isMoveOpen} onClose={onMoveClose}>
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
                        <Button variant="ghost" onPress={onMoveClose}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}


//                        <Select
//                            isMultiline
//                            items={[]}
//                            label="Tags"
//                            labelPlacement="inside"
//                            renderValue={(items) => (
//                                <div className="flex flex-wrap gap-2">
//                                    {items.map((item) => (
//                                        <Chip
//                                            key={item.key}
//                                            classNames={{
//                                                base: `bg-${item.data?.color}`
//                                            }}
//                                            onClose={() => setEditableTags((prevTags) => prevTags.filter((tag) => tag.title !== item.data?.title))}
//                                        >{item.data?.title}</Chip>
//                                    ))}
//                                </div>
//                            )}
//                            selectionMode="multiple"
//                            onSelectionChange={(selectedTitles) => {
//                                if (!(selectedTitles instanceof Set)) {
//                                    setEditableTags([])
//                                }
//                                const arrayTitles = Array.from(selectedTitles)
//                                const tagsArray = []
//                                for (const title of arrayTitles) {
//                                    for (const tag of allTags) {
//                                        if (tag.title === title) {
//                                            tagsArray.push(tag)
//                                            break
//                                        }
//                                    }
//                                }
//                                setEditableTags(tagsArray)
//                            }}
//                            selectedKeys={editableTags.map((tag) => tag.title)}
//                        >
//                            {(tag) => (
//                                <SelectItem key={tag.title}>
//                                    {tag.title}
//                                </SelectItem>
//                            )}
//                        </Select>

