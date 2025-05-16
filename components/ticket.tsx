import { Database } from "@/database/supabase";
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
    Select,
    Chip,
    SelectItem,
} from "@heroui/react";
import { getLocalTimeZone, today, parseDate, CalendarDate } from "@internationalized/date";
import {
    Key,
    useCallback,
    useState,
} from "react";
import { useContext } from "react";

type Ticket = Database["public"]["Tables"]["ticket"]["Row"]

export default function Ticket({ details }: { details: Ticket }) {
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
    const onDetailsSave = useCallback(() => {
        //        updateTicket({
        //            id: details.id,
        //            title: editableTitle,
        //            description: editableDescription,
        //            startDate: editableStartDate,
        //            dueDate: editableDueDate,
        //            tags: editableTags
        //        })
        onDetailsClose();
    }, [
        details.id,
        editableTitle,
        editableDescription,
        editableStartDate,
        editableDueDate,
        onDetailsClose,
    ])
    const onMoveAction = useCallback((action: Key) => {
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
                        <Input
                            label="Title"
                            labelPlacement="inside"
                            name="title"
                            value={editableTitle}
                            onValueChange={setEditableTitle}
                        />
                        <Textarea
                            label="Description"
                            labelPlacement="inside"
                            name="description"
                            value={editableDescription}
                            onValueChange={setEditableDescription}
                        />
                        <div className="flex gap-2 w-full wrap">
                            <DatePicker
                                value={editableStartDate}
                                onChange={setEditableStartDate}
                                label="Start Date"
                                labelPlacement="inside"
                            />
                            <DatePicker
                                value={editableDueDate}
                                onChange={setEditableDueDate}
                                label="Due Date"
                                labelPlacement="inside"
                                minValue={editableStartDate}
                            />
                        </div>
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
                            <div></div>
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

//                            {data.swimlanes.map((swimlane) => {
//                                for (const ticket of swimlane.tickets) {
//                                    if (ticket.id === details.id) {
//                                        return null;
//                                    }
//                                }
//                                return (
//                                    <ListboxItem key={swimlane.id}>
//                                        {swimlane.title}
//                                    </ListboxItem>
//                                )
//                            })}

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

export function AddCardTicket({ swimlaneId, swimlaneTitle, isEmptySwimlane }: { swimlaneId: string, swimlaneTitle: string, isEmptySwimlane?: boolean }) {
    const { addTicket } = useContext(DataContext);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState(parseDate(today(getLocalTimeZone()).toString()));
    const [dueDate, setDueDate] = useState(parseDate(today(getLocalTimeZone()).toString()));
    const [tags, setTags] = useState<Tag[]>([])
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
        const values: AddTicketRequest = {
            swimlaneId,
            title,
            description,
            startDate,
            dueDate,
            tags
        }
        addTicket(values)
        setTitle("")
        setDescription("")
        const todayDate = parseDate(today(getLocalTimeZone()).toString())
        setStartDate(todayDate)
        setDueDate(todayDate)
        setTags([])
        onClose();
    }, [onClose, title, startDate, dueDate, addTicket, swimlaneId, description, tags]);
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
                        <Select
                            isMultiline
                            items={allTags}
                            label="Tags"
                            labelPlacement="inside"
                            renderValue={(items) => (
                                <div className="flex flex-wrap gap-2">
                                    {items.map((item) => (
                                        <Chip
                                            key={item.key}
                                            classNames={{
                                                base: `bg-${item.data?.color}`
                                            }}
                                            onClose={() => setTags((prevTags) => prevTags.filter((tag) => tag.title !== item.data?.title))}
                                        >{item.data?.title}</Chip>
                                    ))}
                                </div>
                            )}
                            selectionMode="multiple"
                            onSelectionChange={(selectedTitles) => {
                                if (!(selectedTitles instanceof Set)) {
                                    setTags([])
                                }
                                const arrayTitles = Array.from(selectedTitles)
                                const tagsArray = []
                                for (const title of arrayTitles) {
                                    for (const tag of allTags) {
                                        if (tag.title === title) {
                                            tagsArray.push(tag)
                                            break
                                        }
                                    }
                                }
                                setTags(tagsArray)
                            }}
                            selectedKeys={tags.map((tag) => tag.title)}
                        >
                            {(tag) => (
                                <SelectItem key={tag.title}>
                                    {tag.title}
                                </SelectItem>
                            )}
                        </Select>
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
