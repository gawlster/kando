import DefaultLayout from "@/layouts/DefaultLayout";
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
import {
    Key,
    useCallback,
    useState,
} from "react";

export default function IndexPage() {
    const [data, setData] = useState({
        swimlanes: [
            {
                id: "backlog",
                title: "Backlog",
                tickets: [
                    { id: "1", title: "Ticket 1" },
                    { id: "2", title: "Ticket 2" },
                    { id: "3", title: "Ticket 3" },
                ],
            },
            {
                id: "in-progress",
                title: "In Progress",
                tickets: [
                    { id: "4", title: "Ticket 4" },
                    { id: "5", title: "Ticket 5" },
                ],
            },
            {
                id: "done",
                title: "Done",
                tickets: [{ id: "6", title: "Ticket 6" }],
            },
        ],
    });

    return (
        <DefaultLayout>
            <div className="flex gap-4">
                {data.swimlanes.map((swimlane) => (
                    <Swimlane key={swimlane.id} details={swimlane} />
                ))}
            </div>
        </DefaultLayout>
    )
}

type Swimlane = {
    id: string;
    title: string;
    tickets: Ticket[];
};

function Swimlane({ details }: { details: Swimlane }) {
    return (
        <div className="h-full flex flex-col w-[272px]">
            <span>{details.title}</span>
            <div
                className="h-full p-2 bg-slate-700 flex flex-col gap-1 rounded-md"
            >
                {details.tickets.map((ticket) => (
                    <Ticket key={ticket.id} details={ticket} />
                ))}
            </div>
        </div>
    );
}

type Ticket = {
    id: string;
    title: string;
};

const Ticket = ({ details }: { details: Ticket }) => {
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
    }, []);
    const onMoveAction = useCallback((action: Key) => {
        console.log("Move action", action);
    }, []);
    return (
        <>
            <Dropdown>
                <DropdownTrigger>
                    <Card className="w-64" isPressable>
                        <CardBody>
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
                            <ListboxItem key="backlog">Backlog</ListboxItem>
                            <ListboxItem key="in-progress">In Progress</ListboxItem>
                            <ListboxItem key="done">Done</ListboxItem>
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
