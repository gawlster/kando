import { useAddTicket } from "@/data/tickets";
import { useEnter } from "@/hooks/useEnter";
import { useTagFilters } from "@/hooks/useTagFilters";
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
import {
  getLocalTimeZone,
  parseDate,
  today,
  type CalendarDate,
} from "@internationalized/date";
import { useCallback, useState } from "react";
import TicketForm from "./ticket-form";

export default function AddTicketCard({
  swimlaneId,
  swimlaneTitle,
  isEmptySwimlane,
}: {
  swimlaneId: number;
  swimlaneTitle: string;
  isEmptySwimlane?: boolean;
}) {
  const { mutateAsync: doAddTicket } = useAddTicket(swimlaneId);
  const { tagFilters } = useTagFilters();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(
    parseDate(today(getLocalTimeZone()).toString())
  );
  const [dueDate, setDueDate] = useState(
    parseDate(today(getLocalTimeZone()).toString())
  );
  const [selectedTagIds, setSelectedTagIds] = useState<Set<string>>(
    new Set(tagFilters.split(",").map((tagId) => tagId.trim()))
  );
  const handlePress = useCallback(() => {
    onOpen();
  }, [onOpen]);
  const handleStartDateChange = useCallback(
    (date: CalendarDate) => {
      setStartDate(date);
      if (date > dueDate) {
        setDueDate(date);
      }
    },
    [dueDate]
  );
  const handleSubmit = useCallback(async () => {
    try {
      await doAddTicket({
        title,
        description,
        startDate: startDate.toString(),
        dueDate: dueDate.toString(),
        swimlaneId,
        tagIds: Array.from(selectedTagIds).map((tagId) => Number(tagId)),
      });
    } catch (_) {
      // do nothing, handled in the hook
    }
    setTitle("");
    setDescription("");
    setStartDate(parseDate(today(getLocalTimeZone()).toString()));
    setDueDate(parseDate(today(getLocalTimeZone()).toString()));
    setSelectedTagIds(new Set());
    onClose();
  }, [
    doAddTicket,
    title,
    description,
    startDate,
    dueDate,
    swimlaneId,
    selectedTagIds,
    onClose,
  ]);
  useEnter(handleSubmit, isOpen);
  return (
    <>
      <Card
        className={`w-64 h-16 min-h-16 bg-background/25 text-background font-bold border border-dashed border-background mt-2 ${isEmptySwimlane && "mb-2"}`}
        isPressable
        onPress={handlePress}
      >
        <CardBody className="justify-center items-center">
          <span>Add card</span>
        </CardBody>
      </Card>
      <Modal isOpen={isOpen} onClose={onClose} isDismissable={false}>
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
  );
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
  );
}
