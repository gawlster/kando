import { useDeleteSwimlane, useMoveSwimlane, useSortTickets } from "@/data/swimlanes";
import { useTickets } from "@/data/tickets";
import { Database } from "@/database/supabase";
import { useEnter } from "@/hooks/useEnter";
import { useTagFilters } from "@/hooks/useTagFilters";
import { Button, Input, Listbox, ListboxItem, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Popover, PopoverContent, PopoverTrigger, useDisclosure } from "@heroui/react";
import { useCallback, useEffect, useState } from "react";
import { type ResponseType as GetTicketsResponse } from "../pages/api/getTickets/[swimlaneId]";
import AddTicketCard, { DisabledAddTicketCard } from "./add-ticket-card";
import SortableSwimlane from "./sortable-swimlane";
import Ticket from "./ticket";

type Swimlane = Database["public"]["Tables"]["swimlane"]["Row"]

export default function Swimlane({ details }: { details: Swimlane }) {
    const { tagFilters } = useTagFilters();
    const { data: tickets, isLoading: ticketsLoading } = useTickets({ swimlaneId: details.id, tagFilters });

    if (ticketsLoading || !tickets) {
        return (
            <Layout details={details} tickets={[]}>
                <DisabledAddTicketCard />
            </Layout>
        )
    }

    return (
        <Layout details={details} tickets={tickets}>
            {tickets.map((ticket) => (
                <Ticket key={ticket.id} details={ticket} />
            ))}
            <AddTicketCard
                swimlaneId={details.id}
                swimlaneTitle={details.title}
                isEmptySwimlane={tickets.length === 0}
            />
        </Layout>
    );
}


function Layout({ children, details, tickets }: { children: React.ReactNode; details: Swimlane; tickets: GetTicketsResponse }) {
    return (
        <div className="flex flex-col w-[272px]">
            <Title details={details} tickets={tickets} />
            <div
                className="p-2 flex flex-col gap-1 rounded-md overflow-y-auto max-h-full hide-scrollbar"
                style={{
                    background: `linear-gradient(135deg, ${details.gradientColorStart}, ${details.gradientColorEnd})`,
                    boxShadow: '0 8px 12px rgba(0, 0, 0, 0.50)',
                }}
            >
                {children}
            </div>
        </div>
    );
}

function Title({ details, tickets }: { details: Swimlane; tickets: GetTicketsResponse }) {
    const { mutateAsync: doMoveSwimlane } = useMoveSwimlane();
    const { mutateAsync: doSortTickets } = useSortTickets(details.id);
    const { mutateAsync: doDeleteSwimlane, isPending: deleteLoading } = useDeleteSwimlane();
    const [confirmDeleteTitle, setConfirmDeleteTitle] = useState("");
    const { isOpen: isConfirmDeleteModalOpen, onOpen: onConfirmDeleteModalOpen, onClose: onConfirmDeleteModalClose } = useDisclosure();
    const { isOpen: isSortTicketsModalOpen, onOpen: onSortTicketsModalOpen, onClose: onSortTicketsModalClose } = useDisclosure();
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [sortableTickets, setSortableTickets] = useState(tickets);
    useEffect(() => {
        setSortableTickets(tickets);
    }, [tickets]);
    const handleListboxActions = useCallback(async (action: string) => {
        switch (action) {
            case "sort":
                onSortTicketsModalOpen();
                break;
            case "move-left":
                try {
                    await doMoveSwimlane({ id: details.id, direction: "left" });
                } catch (_) {
                    // do nothing, handled in the hook
                }
                break;
            case "move-right":
                try {
                    await doMoveSwimlane({ id: details.id, direction: "right" });
                } catch (_) {
                    // do nothing, handled in the hook
                }
                break;
            case "delete":
                setConfirmDeleteTitle("");
                onConfirmDeleteModalOpen();
                break;
            default:
                console.warn(`Unknown action: ${action}`);
        }
        setPopoverOpen(false);
    }, [
        details.id,
        doMoveSwimlane,
        onSortTicketsModalOpen,
        onConfirmDeleteModalOpen
    ]);
    const handleConfirmSortTickets = useCallback(async () => {
        try {
            await doSortTickets({ swimlaneId: details.id, tickets: sortableTickets.map(ticket => ({ id: ticket.id })) });
        } catch (_) {
            // do nothing, handled in the hook
        }
        onSortTicketsModalClose();
    }, [
        details.id,
        doSortTickets,
        sortableTickets,
        onSortTicketsModalClose
    ]);
    const handleConfirmDeleteSwimlane = useCallback(async () => {
        try {
            await doDeleteSwimlane({ id: details.id });
        } catch (_) {
            // do nothing, handled in the hook
        }
        onConfirmDeleteModalClose();
    }, [
        details.id,
        doDeleteSwimlane,
        onConfirmDeleteModalClose
    ]);
    useEnter(handleConfirmDeleteSwimlane, isConfirmDeleteModalOpen && confirmDeleteTitle === details.title);
    return (
        <>
            <Popover placement="bottom-start" isOpen={popoverOpen} onOpenChange={setPopoverOpen}>
                <PopoverTrigger>
                    <span className="cursor-pointer">▼ {details.title}</span>
                </PopoverTrigger>
                <PopoverContent>
                    <div>
                        <Listbox aria-label="Swimlane Actions" onAction={(action) => handleListboxActions(action as string)}>
                            <ListboxItem key="sort">Sort tickets</ListboxItem>
                            <ListboxItem key="move-left">Move swimlane left</ListboxItem>
                            <ListboxItem key="move-right">Move swimlane right</ListboxItem>
                            <ListboxItem key="delete">Delete swimlane</ListboxItem>
                        </Listbox>
                    </div>
                </PopoverContent>
            </Popover>
            <Modal isOpen={isConfirmDeleteModalOpen} onClose={onConfirmDeleteModalClose} isDismissable={false}>
                <ModalContent>
                    <ModalHeader>Confirm Delete</ModalHeader>
                    <ModalBody>
                        <p>Warning: This will also delete all tickets currently in the swimlane. This action cannot be undone.</p>
                        <p>Enter the swimlane{"'"}s title {'"'}{details.title}{'"'} to continue.</p>
                        <Input
                            label="Title"
                            labelPlacement="inside"
                            name="title"
                            value={confirmDeleteTitle}
                            onValueChange={setConfirmDeleteTitle}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" onPress={onConfirmDeleteModalClose} disabled={deleteLoading}>
                            Cancel
                        </Button>
                        <Button onPress={handleConfirmDeleteSwimlane} isLoading={deleteLoading} isDisabled={confirmDeleteTitle !== details.title} color="danger">
                            {deleteLoading ? "Loading..." : "Add"}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Modal isOpen={isSortTicketsModalOpen} onClose={onSortTicketsModalClose} isDismissable={false}>
                <ModalContent>
                    <ModalHeader>Sort Tickets</ModalHeader>
                    <ModalBody>
                        <SortableSwimlane sortableTickets={sortableTickets} setSortableTickets={setSortableTickets} />
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" onPress={onSortTicketsModalClose}>
                            Cancel
                        </Button>
                        <Button onPress={handleConfirmSortTickets} isLoading={false}>
                            Confirm Sort
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}
