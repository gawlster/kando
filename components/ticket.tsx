import { Database } from "@/database/supabase";
import { usePost } from "@/hooks/usePost";
import { AvailableSwimlanesContext } from "@/pages";
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
    Input,
    DatePicker,
    Textarea,
} from "@heroui/react";
import { getLocalTimeZone, today, parseDate, CalendarDate } from "@internationalized/date";
import {
    Key,
    useCallback,
    useState,
} from "react";
import { useContext } from "react";
import {
    type BodyType as UpdateTicketBody,
    type ResponseType as UpdateTicketResponse,
    url as updateTicketUrl
} from "../pages/api/updateTicket";
import { useFetch } from "@/hooks/useFetch";

type Ticket = Database["public"]["Tables"]["ticket"]["Row"]

export default function Ticket({ details, refetchSwimlane }: { details: Ticket; refetchSwimlane: () => Promise<void> }) {
    const {
        doPost: updateTicketPost,
        loading: updateLoading,
        error: updateError
    } = usePost<UpdateTicketBody, UpdateTicketResponse>(updateTicketUrl)
    const { swimlanes: availableSwimlanes } = useContext(AvailableSwimlanesContext)
    const [editableTitle, setEditableTitle] = useState(details.title)
    const [editableDescription, setEditableDescription] = useState(details.description)
    const [editableStartDate, setEditableStartDate] = useState(parseDate(details.startDate))
    const [editableDueDate, setEditableDueDate] = useState(parseDate(details.dueDate))
    const { isOpen: isDetailsOpen, onOpen: onDetailsOpen, onClose: onDetailsClose } = useDisclosure();
    const { isOpen: isMoveOpen, onOpen: onMoveOpen, onClose: onMoveClose } = useDisclosure();
    const onCardDropdownAction = useCallback((action: Key) => {
        switch (action) {
            case "view":
                onDetailsOpen();
                break;
            case "move":
                onMoveOpen();
                break;
            default:
                break;
        }
    }, [onDetailsOpen, onMoveOpen]);
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
        await refetchSwimlane()
        onDetailsClose();
    }, [
        details,
        editableTitle,
        editableDescription,
        editableStartDate,
        editableDueDate,
        updateTicketPost,
        onDetailsClose,
        refetchSwimlane
    ])
    const onMoveAction = useCallback((action: Key) => {
        console.log("Move action", action)
        //         moveTicket({
        //             destinationSwimlaneId: action as string,
        //             ticket: details
        //         })
        onMoveClose();
    }, [
        details,
        onMoveClose
    ]);

    return (
        <>
            <Dropdown>
                <DropdownTrigger>
                    <Card className="w-64 bg-background/70 h-20 min-h-20" isPressable isBlurred style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.45)' }}>
                        <CardBody className="h-full justify-center">
                            <span className="font-semibold">{details.title}</span>
                            <span>Card body: TODO</span>
                        </CardBody>
                    </Card>
                </DropdownTrigger>
                <DropdownMenu onAction={onCardDropdownAction}>
                    <DropdownItem key="move">Move card</DropdownItem>
                    <DropdownItem key="view">View details</DropdownItem>
                </DropdownMenu>
            </Dropdown>
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

export function AddCardTicket({ swimlaneId, swimlaneTitle, isEmptySwimlane }: { swimlaneId: number, swimlaneTitle: string, isEmptySwimlane?: boolean }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState(parseDate(today(getLocalTimeZone()).toString()));
    const [dueDate, setDueDate] = useState(parseDate(today(getLocalTimeZone()).toString()));
    const [tags, setTags] = useState<any[]>([])
    const handlePress = useCallback(() => {
        onOpen();
    }, [onOpen]);
    const handleStartDateChange = useCallback((date: CalendarDate) => {
        setStartDate(date);
        if (date > dueDate) {
            setDueDate(date);
        }
    }, [dueDate]);
    const handleSubmit = useCallback(() => {
        //         const values: AddTicketRequest = {
        //             swimlaneId,
        //             title,
        //             description,
        //             startDate,
        //             dueDate,
        //             tags
        //         }
        //         addTicket(values)
        setTitle("")
        setDescription("")
        const todayDate = parseDate(today(getLocalTimeZone()).toString())
        setStartDate(todayDate)
        setDueDate(todayDate)
        setTags([])
        onClose();
    }, [
        onClose,
        title,
        startDate,
        dueDate,
        swimlaneId,
        description,
        tags
    ]);
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault()
            handleSubmit()
        }
    }, [handleSubmit])
    return (
        <>
            <Card
                className={`w-64 h-16 min-h-16 bg-background/25 text-background font-bold border border-dashed border-background mt-2 ${isEmptySwimlane && "mb-2"}`}
                isPressable
                onPress={handlePress}>
                <CardBody className="justify-center items-center">
                    <span>Add card</span>
                </CardBody>
            </Card>
            <Modal isOpen={isOpen} onClose={onClose} onKeyDown={handleKeyDown}>
                <ModalContent>
                    <ModalHeader>Add Ticket to {swimlaneTitle}</ModalHeader>
                    <ModalBody>
                        <TicketForm
                            title={title}
                            setTitle={setTitle}
                            description={description}
                            setDescription={setDescription}
                            startDate={startDate}
                            handleStartDateChange={handleStartDateChange}
                            dueDate={dueDate}
                            setDueDate={setDueDate}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" onPress={onClose}>
                            Close
                        </Button>
                        <Button variant="solid" onPress={() => handleSubmit()}>
                            Submit
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}


function TicketForm({
    title,
    setTitle,
    description,
    setDescription,
    startDate,
    handleStartDateChange,
    dueDate,
    setDueDate
}: {
    title: string,
    setTitle: (title: string) => void,
    description: string,
    setDescription: (description: string) => void,
    startDate: CalendarDate,
    handleStartDateChange: (date: CalendarDate) => void,
    dueDate: CalendarDate,
    setDueDate: (date: CalendarDate) => void
}) {
    return (
        <>
            <Input
                label="Title"
                labelPlacement="inside"
                name="title"
                value={title}
                onValueChange={setTitle}
            />
            <Textarea
                label="Description"
                labelPlacement="inside"
                name="description"
                value={description}
                onValueChange={setDescription}
            />
            <div className="flex gap-2 w-full wrap">
                <DatePicker
                    value={startDate}
                    onChange={handleStartDateChange}
                    label="Start Date"
                    labelPlacement="inside"
                />
                <DatePicker
                    value={dueDate}
                    onChange={setDueDate}
                    label="Due Date"
                    labelPlacement="inside"
                    minValue={startDate}
                />
            </div>
        </>
    )
}
