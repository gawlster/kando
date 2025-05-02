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
import { createContext, useContext } from "react";

const DataContext = createContext<{
    data: { swimlanes: Swimlane[] },
    setData: React.Dispatch<React.SetStateAction<{ swimlanes: Swimlane[] }>>
}>({ data: { swimlanes: [] }, setData: () => { } });

export default function IndexPage() {
    const [data, setData] = useState<{ swimlanes: Swimlane[] }>({
        swimlanes: [
            {
                id: "backlog",
                title: "Backlog",
                gradientColors: ["#e8f1fb", "#dbeeff"],
                tickets: [
                    { id: "1", title: "Ticket 1" },
                    { id: "2", title: "Ticket 2" },
                    { id: "3", title: "Ticket 3" },
                ],
            },
            {
                id: "in-progress",
                title: "In Progress",
                gradientColors: ["#f1fff8", "#d9f5e5"],
                tickets: [
                    { id: "4", title: "Ticket 4" },
                    { id: "5", title: "Ticket 5" },
                ],
            },
            {
                id: "done",
                title: "Done",
                gradientColors: ["#f8f4ff", "#e9ddf9"],
                tickets: [{ id: "6", title: "Ticket 6" }],
            },
        ],
    });

    return (
        <DataContext.Provider value={{ data, setData }}>
            <DefaultLayout>
                <div className="flex gap-4 h-full w-fit">
                    {data.swimlanes.map((swimlane) => (
                        <Swimlane key={swimlane.id} details={swimlane} />
                    ))}
                </div>
            </DefaultLayout>
        </DataContext.Provider>
    )
}

type Swimlane = {
    id: string;
    title: string;
    gradientColors: string[];
    tickets: Ticket[];
};

function Swimlane({ details }: { details: Swimlane }) {
    return (
        <div className="flex flex-col w-[272px]">
            <span>{details.title}</span>
            <div
                className="p-2 flex flex-col gap-1 rounded-md overflow-y-auto max-h-full hide-scrollbar"
                style={{
                    background: `linear-gradient(135deg, ${details.gradientColors.join(", ")})`,
                    boxShadow: '0 8px 12px rgba(0, 0, 0, 0.50)',
                }}
            >
                {details.tickets.map((ticket) => (
                    <Ticket key={ticket.id} details={ticket} />
                ))}
                <AddCardTicket swimlaneId={details.id} isEmptySwimlane={details.tickets.length == 0} />
            </div>
        </div>
    );
}

type Ticket = {
    id: string;
    title: string;
};

const Ticket = ({ details }: { details: Ticket }) => {
    const { data, setData } = useContext(DataContext);
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
        setData((prevData) => ({
            ...prevData,
            swimlanes: data.swimlanes.map((swimlane) => {
                if (swimlane.id === action) {
                    return {
                        ...swimlane,
                        tickets: [...swimlane.tickets, details],
                    };
                }
                return {
                    ...swimlane,
                    tickets: swimlane.tickets.filter((ticket) => ticket.id !== details.id),
                };
            })
        }));
        onMoveClose();
    }, [data.swimlanes, details, onMoveClose, setData]);

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
                            {data.swimlanes.map((swimlane) => (
                                <ListboxItem key={swimlane.id}>
                                    {swimlane.title}
                                </ListboxItem>
                            ))}
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

const AddCardTicket = ({ swimlaneId, isEmptySwimlane }: { swimlaneId: string, isEmptySwimlane?: boolean }) => {
    const handlePress = useCallback(() => {
        console.log("Add card to swimlane", swimlaneId);
    }, [swimlaneId]);
    return (
        <Card
            className={`w-64 h-16 min-h-16 bg-background/25 text-background font-bold border border-dashed border-background mt-2 ${isEmptySwimlane && "mb-2"}`}
            isPressable
            onPress={handlePress}>
            <CardBody className="justify-center items-center">
                <span>Add card</span>
            </CardBody>
        </Card>
    )
}
