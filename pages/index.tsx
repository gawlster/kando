import DefaultLayout from "@/layouts/DefaultLayout";
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

const data = {
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
};

export default function IndexPage() {
  return (
    <DefaultLayout>
      <div className="flex flex-row h-full gap-4">
        {data.swimlanes.map((swimlane) => (
          <Swimlane key={swimlane.id} details={swimlane} />
        ))}
      </div>
    </DefaultLayout>
  );
}

type Swimlane = {
  id: string;
  title: string;
  tickets: Ticket[];
};

function Swimlane({ details }: { details: Swimlane }) {
  return (
    <div className="h-full flex flex-col">
      <span>{details.title}</span>
      <div className="h-full p-2 bg-slate-700 flex flex-col gap-1 rounded-md">
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

function Ticket({ details }: { details: Ticket }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      <Card className="w-64" isPressable onPress={onOpen}>
        <CardBody>
          <span className="font-semibold">{details.title}</span>
          <span>Card body</span>
        </CardBody>
      </Card>
      <Modal
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Modal Title
              </ModalHeader>
              <ModalBody>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nullam pulvinar risus non risus hendrerit venenatis.
                  Pellentesque sit amet hendrerit risus, sed porttitor quam.
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nullam pulvinar risus non risus hendrerit venenatis.
                  Pellentesque sit amet hendrerit risus, sed porttitor quam.
                </p>
                <p>
                  Magna exercitation reprehenderit magna aute tempor cupidatat
                  consequat elit dolor adipisicing. Mollit dolor eiusmod sunt ex
                  incididunt cillum quis. Velit duis sit officia eiusmod Lorem
                  aliqua enim laboris do dolor eiusmod. Et mollit incididunt
                  nisi consectetur esse laborum eiusmod pariatur proident Lorem
                  eiusmod et. Culpa deserunt nostrud ad veniam.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
