import DefaultLayout from "@/layouts/DefaultLayout";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  UniqueIdentifier,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type ActiveTicket = {
  uid: UniqueIdentifier;
  ticket: Ticket;
  lastHoveredList: string;
  lastHoveredIndex: number;
} | null;

const ActiveTicketContext = createContext<ActiveTicket>(null);

export default function IndexPage() {
  const [activeTicket, setActiveTicket] = useState<ActiveTicket>(null);
  const sensors = useSensors(useSensor(PointerSensor));
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
  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const swimlane = data.swimlanes.find(
        (swimlane) =>
          swimlane.id === event.active.data.current?.sortable?.containerId
      );
      if (!swimlane) {
        return;
      }
      const ticket =
        swimlane.tickets[event.active.data.current?.sortable?.index];
      setActiveTicket({
        uid: event.active.id,
        ticket,
        lastHoveredList: swimlane.id,
        lastHoveredIndex: event.active.data.current?.sortable?.index,
      });
    },
    [data.swimlanes]
  );
  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      if (!activeTicket) {
        return;
      }
      const hoveringList = event.over?.data.current?.sortable?.containerId;
      const hoveringIndex = event.over?.data.current?.sortable?.index;
      if (!hoveringList || hoveringList === activeTicket?.lastHoveredList) {
        if (hoveringIndex !== activeTicket?.lastHoveredIndex) {
          setActiveTicket((prev) => {
            if (prev) {
              return {
                ...prev,
                lastHoveredIndex: hoveringIndex,
              };
            }
            return prev;
          });
        }
        return;
      }
      setData((prev) => {
        const newSwimlanes = prev.swimlanes.map((swimlane) => {
          if (swimlane.id === activeTicket?.lastHoveredList) {
            return {
              ...swimlane,
              tickets: swimlane.tickets.filter(
                (ticket) => ticket.id !== activeTicket?.ticket.id
              ),
            };
          }
          if (swimlane.id === hoveringList) {
            return {
              ...swimlane,
              tickets: swimlane.tickets
                .slice(0, hoveringIndex)
                .concat(activeTicket?.ticket)
                .concat(swimlane.tickets.slice(hoveringIndex)),
            };
          }
          return swimlane;
        });
        return {
          ...prev,
          swimlanes: newSwimlanes as Swimlane[],
        };
      });
      setActiveTicket((prev) => {
        if (prev) {
          return {
            ...prev,
            lastHoveredList: hoveringList,
            lastHoveredIndex: hoveringIndex,
          };
        }
        return prev;
      });
    },
    [activeTicket]
  );
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    if (event.active.id !== event.over?.id) {
      const startingList = event.active.data.current?.sortable?.containerId;
      const startingIndex = event.active.data.current?.sortable?.index;
      const endingList = event.over?.data.current?.sortable?.containerId;
      const endingIndex = event.over?.data.current?.sortable?.index;
      console.log(
        `Moving ticket from index ${startingIndex} in ${startingList} to index ${endingIndex} in ${endingList}`
      );
    }
    setActiveTicket(null);
  }, []);
  useEffect(() => {
    console.log(activeTicket);
  }, [activeTicket]);
  return (
    <ActiveTicketContext.Provider value={activeTicket}>
      <DefaultLayout>
        <div className="flex flex-row h-full gap-4">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            {data.swimlanes.map((swimlane) => (
              <Swimlane key={swimlane.id} details={swimlane} />
            ))}
            <DragOverlay>
              {activeTicket ? <Ticket details={activeTicket.ticket} /> : null}
            </DragOverlay>
          </DndContext>
        </div>
      </DefaultLayout>
    </ActiveTicketContext.Provider>
  );
}

type Swimlane = {
  id: string;
  title: string;
  tickets: Ticket[];
};

function Swimlane({ details }: { details: Swimlane }) {
  const { setNodeRef } = useDroppable({ id: details.id });
  return (
    <SortableContext
      id={details.id}
      items={details.tickets}
      strategy={verticalListSortingStrategy}
    >
      <div className="h-full flex flex-col w-[272px]">
        <span>{details.title}</span>
        <div
          className="h-full p-2 bg-slate-700 flex flex-col gap-1 rounded-md"
          ref={setNodeRef}
        >
          {details.tickets.map((ticket) => (
            <SortableTicket key={ticket.id} details={ticket} />
          ))}
        </div>
      </div>
    </SortableContext>
  );
}

type Ticket = {
  id: string;
  title: string;
};

const Ticket = ({ details }: { details: Ticket }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      <Card className="w-64" isPressable={false} onPress={onOpen}>
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
};

function SortableTicket({ details }: { details: Ticket }) {
  const activeTicket = useContext(ActiveTicketContext);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: details.id });
  let style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  if (activeTicket && activeTicket.ticket.id === details.id) {
    style = { ...style, opacity: 0 };
  }
  return (
    <div
      id={details.id}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <Ticket details={details} />
    </div>
  );
}
