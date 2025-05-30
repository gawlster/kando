import { Database } from "@/database/supabase";
import Ticket from "./ticket"
import AddTicketCard, { DisabledAddTicketCard } from "./add-ticket-card"
import { useFetch } from "@/hooks/useFetch";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ResponseType as GetTicketsResponse, url } from "../pages/api/getTickets/[swimlaneId]";
import { RefetchDataFunctionsContext } from "@/pages";
import { Listbox, ListboxItem, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import { usePost } from "@/hooks/usePost";
import {
    type BodyType as MoveSwimlaneBody,
    type ResponseType as MoveSwimlaneResponse,
    url as moveSwimlaneUrl
} from "../pages/api/moveSwimlane";

type Swimlane = Database["public"]["Tables"]["swimlane"]["Row"]

export default function Swimlane({ details }: { details: Swimlane }) {
    const { registerRefetchFunction } = useContext(RefetchDataFunctionsContext)
    const { data: tickets, loading, refetch } = useFetch<GetTicketsResponse>(`${url}/${details.id}`)
    const layoutProps = useMemo(() => ({
        id: details.id,
        title: details.title,
        gradientColorStart: details.gradientColorStart,
        gradientColorEnd: details.gradientColorEnd
    }), [details.title, details.gradientColorStart, details.gradientColorEnd])

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
    const { refetchAllSwimlanes } = useContext(RefetchDataFunctionsContext);
    const [popoverOpen, setPopoverOpen] = useState(false);
    const { doPost: moveSwimlane, loading: moveSwimlaneLoading } = usePost<MoveSwimlaneBody, MoveSwimlaneResponse>(moveSwimlaneUrl);
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
            default:
                console.warn(`Unknown action: ${action}`);
        }
        setPopoverOpen(false);
    }, [
        id,
        moveSwimlane,
        setPopoverOpen,
    ]);
    return (
        <Popover placement="bottom-start" isOpen={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger>
                <span className="cursor-pointer">{title}</span>
            </PopoverTrigger>
            <PopoverContent>
                <div>
                    <Listbox aria-label="Swimlane Actions" onAction={(action) => handleListboxActions(action as string)}>
                        <ListboxItem key="move-left">Move swimlane left</ListboxItem>
                        <ListboxItem key="move-right">Move swimlane right</ListboxItem>
                    </Listbox>
                </div>
            </PopoverContent>
        </Popover>
    )
}

