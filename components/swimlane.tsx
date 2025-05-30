import { Database } from "@/database/supabase";
import Ticket from "./ticket"
import AddTicketCard, { DisabledAddTicketCard } from "./add-ticket-card"
import { useFetch } from "@/hooks/useFetch";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ResponseType as GetTicketsResponse, url } from "../pages/api/getTickets/[swimlaneId]";
import { RefetchDataFunctionsContext } from "@/pages";
import {
    Button,
    Input,
    Listbox,
    ListboxItem,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Popover,
    PopoverContent,
    PopoverTrigger,
    useDisclosure
} from "@heroui/react";
import { usePost } from "@/hooks/usePost";
import {
    type BodyType as MoveSwimlaneBody,
    type ResponseType as MoveSwimlaneResponse,
    url as moveSwimlaneUrl
} from "../pages/api/moveSwimlane";
import {
    type BodyType as DeleteSwimlaneBody,
    type ResponseType as DeleteSwimlaneResponse,
    url as deleteSwimlaneUrl
} from "../pages/api/deleteSwimlane";
import { useEnter } from "@/hooks/useEnter";

type Swimlane = Database["public"]["Tables"]["swimlane"]["Row"]

export default function Swimlane({ details }: { details: Swimlane }) {
    const { registerRefetchFunction } = useContext(RefetchDataFunctionsContext)
    const { data: tickets, loading, refetch } = useFetch<GetTicketsResponse>(`${url}/${details.id}`)
    const layoutProps = useMemo(() => ({
        id: details.id,
        title: details.title,
        gradientColorStart: details.gradientColorStart,
        gradientColorEnd: details.gradientColorEnd
    }), [
        details.id,
        details.title,
        details.gradientColorStart,
        details.gradientColorEnd
    ])

    useEffect(() => {
        registerRefetchFunction(details.id, refetch);
    }, [
        details.id,
        refetch,
        registerRefetchFunction
    ])

    if (loading || !tickets) {
        return (
            <Layout {...layoutProps}>
                <DisabledAddTicketCard />
            </Layout>
        )
    }

    return (
        <Layout {...layoutProps}>
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

function Layout({
    children,
    id,
    title,
    gradientColorStart,
    gradientColorEnd
}: {
    children?: React.ReactNode,
    id: number,
    title: string,
    gradientColorStart: string,
    gradientColorEnd: string
}) {
    return (
        <div className="flex flex-col w-[272px]">
            <Title id={id} title={title} />
            <div
                className="p-2 flex flex-col gap-1 rounded-md overflow-y-auto max-h-full hide-scrollbar"
                style={{
                    background: `linear-gradient(135deg, ${gradientColorStart}, ${gradientColorEnd})`,
                    boxShadow: '0 8px 12px rgba(0, 0, 0, 0.50)',
                }}
            >
                {children}
            </div>
        </div>
    );
}

function Title({ id, title }: { id: number, title: string }) {
    const [confirmDeleteTitle, setConfirmDeleteTitle] = useState("");
    const { isOpen: isConfirmDeleteModalOpen, onOpen: onConfirmDeleteModalOpen, onClose: onConfirmDeleteModalClose } = useDisclosure();
    const { refetchAllSwimlanes } = useContext(RefetchDataFunctionsContext);
    const [popoverOpen, setPopoverOpen] = useState(false);
    const { doPost: moveSwimlane, loading: moveSwimlaneLoading } = usePost<MoveSwimlaneBody, MoveSwimlaneResponse>(moveSwimlaneUrl);
    const { doPost: deleteSwimlane, loading: deleteLoading } = usePost<DeleteSwimlaneBody, DeleteSwimlaneResponse>(deleteSwimlaneUrl);
    const handleListboxActions = useCallback(async (action: string) => {
        switch (action) {
            case "move-left":
                await moveSwimlane({ id, direction: "left" });
                await refetchAllSwimlanes();
                break;
            case "move-right":
                await moveSwimlane({ id, direction: "right" });
                await refetchAllSwimlanes();
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
        id,
        moveSwimlane,
        refetchAllSwimlanes,
        setPopoverOpen
    ]);
    const handleConfirmDeleteSwimlane = useCallback(async () => {
        await deleteSwimlane({ id });
        await refetchAllSwimlanes();
        onConfirmDeleteModalClose();
    }, [
        deleteSwimlane,
        id,
        refetchAllSwimlanes,
        onConfirmDeleteModalClose
    ]);
    const { enable, disable } = useEnter(handleConfirmDeleteSwimlane)
    useEffect(() => {
        if (isConfirmDeleteModalOpen && confirmDeleteTitle === title) {
            enable();
        } else {
            disable();
        }
    }, [
        isConfirmDeleteModalOpen,
        confirmDeleteTitle,
        title,
        enable,
        disable
    ]);
    return (
        <>
            <Popover placement="bottom-start" isOpen={popoverOpen} onOpenChange={setPopoverOpen}>
                <PopoverTrigger>
                    <span className="cursor-pointer">{title}</span>
                </PopoverTrigger>
                <PopoverContent>
                    <div>
                        <Listbox aria-label="Swimlane Actions" onAction={(action) => handleListboxActions(action as string)}>
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
                        <p>Enter the swimlane's title "{title}" to continue.</p>
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
                        <Button onPress={handleConfirmDeleteSwimlane} isLoading={deleteLoading} isDisabled={confirmDeleteTitle !== title}>
                            {deleteLoading ? "Loading..." : "Add"}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

