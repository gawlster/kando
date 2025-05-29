import { usePost } from "@/hooks/usePost";
import { RefetchDataFunctionsContext } from "@/pages";
import {
    Button,
    Card,
    CardBody,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    useDisclosure,
} from "@heroui/react";
import { getLocalTimeZone, today, parseDate, CalendarDate } from "@internationalized/date";
import {
    useCallback,
    useState,
} from "react";
import { useContext } from "react";
import {
    type BodyType as AddCardBody,
    type ResponseType as AddCardResponse,
    url as addCardUrl
} from "../pages/api/addTicket";
import TicketForm from "./ticket-form";

export default function AddTicketCard({ swimlaneId, swimlaneTitle, isEmptySwimlane }: { swimlaneId: number, swimlaneTitle: string, isEmptySwimlane?: boolean }) {
    const { refetchSwimlane } = useContext(RefetchDataFunctionsContext)
    const {
        doPost: addTicket,
        loading: addLoading,
        error: addError
    } = usePost<AddCardBody, AddCardResponse>(addCardUrl)
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState(parseDate(today(getLocalTimeZone()).toString()));
    const [dueDate, setDueDate] = useState(parseDate(today(getLocalTimeZone()).toString()));
    const [selectedTagIds, setSelectedTagIds] = useState<Set<string>>(new Set());
    const handlePress = useCallback(() => {
        onOpen();
    }, [onOpen]);
    const handleStartDateChange = useCallback((date: CalendarDate) => {
        setStartDate(date);
        if (date > dueDate) {
            setDueDate(date);
        }
    }, [dueDate]);
    const handleSubmit = useCallback(async () => {
        await addTicket({
            title,
            description,
            startDate: startDate.toString(),
            dueDate: dueDate.toString(),
            swimlaneId,
            tagIds: Array.from(selectedTagIds).map((tagId) => Number(tagId))
        })
        await refetchSwimlane(swimlaneId);
        onClose();
    }, [
        addTicket,
        title,
        description,
        startDate,
        dueDate,
        swimlaneId,
        selectedTagIds,
        refetchSwimlane,
        onClose
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
                            selectedTagIds={selectedTagIds}
                            setSelectedTagIds={setSelectedTagIds}
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

export function DisabledAddTicketCard() {
    return (
        <>
            <Card className="w-64 h-16 min-h-16 bg-background/25 text-background font-bold border border-dashed border-background mt-2 mb-2">
                <CardBody className="justify-center items-center">
                    <span>Add card</span>
                </CardBody>
            </Card>
        </>
    )
}


