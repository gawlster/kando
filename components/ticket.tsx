import { AddTicketRequest, DataContext } from "../pages"
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
} from "@heroui/react";
import { getLocalTimeZone, today, parseDate, CalendarDate } from "@internationalized/date";
import {
    Key,
    useCallback,
    useState,
} from "react";
import { useContext } from "react";

export type Ticket = {
    id: string;
    title: string;
    description: string;
    startDate: CalendarDate;
    dueDate: CalendarDate;
    tags: Tag[]
};

export type Tag = {
    color: string;
    title: string;
}

export default function Ticket({ details }: { details: Ticket }) {
    const { data, moveTicket } = useContext(DataContext);
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
    const onMoveAction = useCallback((action: Key) => {
        moveTicket({
            destinationSwimlaneId: action as string,
            ticket: details
        })
        onMoveClose();
    }, [data.swimlanes, details, onMoveClose, moveTicket]);

    return (
        <>
            <Dropdown>
                <DropdownTrigger>
                    <Card className="w-64 bg-background/70 h-20 min-h-20" isPressable isBlurred style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.45)' }}>
                        <CardBody className="h-full justify-center">
                            <span className="font-semibold">{details.title}</span>
                            <span>Card body</span>
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
                        <div className="flex flex-col gap-2">
                            <span className="font-semibold">{details.title}</span>
                            <span>Card body</span>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" onPress={onDetailsClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Modal isOpen={isMoveOpen} onClose={onMoveClose}>
                <ModalContent>
                    <ModalHeader>Move Ticket</ModalHeader>
                    <ModalBody>
                        <Listbox onAction={onMoveAction}>
                            {data.swimlanes.map((swimlane) => {
                                for (const ticket of swimlane.tickets) {
                                    if (ticket.id === details.id) {
                                        return null;
                                    }
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
};

export function AddCardTicket({ swimlaneId, swimlaneTitle, isEmptySwimlane }: { swimlaneId: string, swimlaneTitle: string, isEmptySwimlane?: boolean }) {
    const { addTicket } = useContext(DataContext);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [title, setTitle] = useState("")
    const [startDate, setStartDate] = useState(parseDate(today(getLocalTimeZone()).toString()));
    const [dueDate, setDueDate] = useState(parseDate(today(getLocalTimeZone()).toString()));
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
            description: "", // TODO
            startDate,
            dueDate,
            tags: [] // TODO
        }
        addTicket(values)
        setTitle("")
        const todayDate = parseDate(today(getLocalTimeZone()).toString())
        setStartDate(todayDate)
        setDueDate(todayDate)
        onClose();
    }, [onClose, title, startDate, dueDate, addTicket, swimlaneId]);
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
