import { Database } from "@/database/supabase";
import Ticket from "./ticket"
import AddTicketCard, { DisabledAddTicketCard } from "./add-ticket-card"
import { useFetch } from "@/hooks/useFetch";
import { useContext, useEffect, useMemo } from "react";
import { ResponseType as GetTicketsResponse, url } from "../pages/api/getTickets/[swimlaneId]";
import { RefetchDataFunctionsContext } from "@/pages";

type Swimlane = Database["public"]["Tables"]["swimlane"]["Row"]

export default function Swimlane({ details }: { details: Swimlane }) {
    const [_, setRefetchFunctions] = useContext(RefetchDataFunctionsContext)
    const { data: tickets, loading, refetch } = useFetch<GetTicketsResponse>(`${url}/${details.id}`)
    const layoutProps = useMemo(() => ({
        title: details.title,
        gradientColorStart: details.gradientColorStart,
        gradientColorEnd: details.gradientColorEnd
    }), [details.title, details.gradientColorStart, details.gradientColorEnd])

    useEffect(() => {
        setRefetchFunctions(prev => {
            return {
                ...prev,
                [details.id]: refetch
            }
        })
    }, [
        details.id,
        refetch,
        setRefetchFunctions
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
    title,
    gradientColorStart,
    gradientColorEnd
}: {
    children?: React.ReactNode,
    title: string,
    gradientColorStart: string,
    gradientColorEnd: string
}) {
    return (
        <div className="flex flex-col w-[272px]">
            <span>{title}</span>
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

