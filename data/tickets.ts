import { useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
    type ResponseType as GetTicketsResponse,
    url as getTicketsUrl
} from "../pages/api/getTickets/[swimlaneId]";
import {
    type BodyType as AddTicketBody,
    type ResponseType as AddTicketResponse,
    url as addTicketUrl
} from "../pages/api/addTicket";
import {
    type BodyType as UpdateTicketBody,
    type ResponseType as UpdateTicketResponse,
    url as updateTicketUrl
} from "../pages/api/updateTicket";
import {
    type BodyType as MoveTicketBody,
    type ResponseType as MoveTicketResponse,
    url as moveTicketUrl
} from "../pages/api/moveTicket";
import { useToastMutation } from "@/hooks/useToastMutation";
import { getAndThrowError } from "@/utils/dataUtils";

export function useTickets({
    swimlaneId,
    tagFilters
}: {
    swimlaneId: number;
    tagFilters: string;
}) {
    return useQuery<GetTicketsResponse, Error>({
        queryKey: ["tickets", swimlaneId, tagFilters],
        queryFn: async () => {
            const res = await fetch(`${getTicketsUrl}/${swimlaneId}?tagFilters=${tagFilters}`);
            if (!res.ok) {
                throw new Error("Failed to fetch tickets");
            }
            return res.json();
        },
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });
}

export function useAddTicket(swimlaneId: number) {
    const queryClient = useQueryClient();
    return useToastMutation<
        AddTicketResponse,
        Error,
        AddTicketBody
    >({
        mutationKey: ["addTicket"],
        mutationFn: async (body) => {
            const res = await fetch(addTicketUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            if (!res.ok) {
                await getAndThrowError(res, "Failed to add ticket");
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tickets", swimlaneId] });
        }
    },
        {
            loading: "Adding ticket...",
            success: "Ticket added successfully!",
            error: (error) => `Failed to add ticket: ${error instanceof Error ? error.message : "Unknown error"}`,
        });
}

export function useUpdateTicket(swimlaneId: number) {
    const queryClient = useQueryClient();
    return useToastMutation<
        UpdateTicketResponse,
        Error,
        UpdateTicketBody
    >({
        mutationKey: ["updateTicket"],
        mutationFn: async (body) => {
            const res = await fetch(updateTicketUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            if (!res.ok) {
                await getAndThrowError(res, "Failed to update ticket");
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tickets", swimlaneId] });
        }
    },
        {
            loading: "Updating ticket...",
            success: "Ticket updated successfully!",
            error: (error) => `Failed to update ticket: ${error instanceof Error ? error.message : "Unknown error"}`,
        });
}

export function useMoveTicket(swimlaneId: number) {
    const newSwimlaneId = useRef(-1);
    const queryClient = useQueryClient();
    return useToastMutation<
        MoveTicketResponse,
        Error,
        MoveTicketBody
    >({
        mutationKey: ["moveTicket"],
        mutationFn: async (body) => {
            newSwimlaneId.current = body.newSwimlaneId;
            const res = await fetch(moveTicketUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            if (!res.ok) {
                await getAndThrowError(res, "Failed to move ticket");
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tickets", swimlaneId] });
            queryClient.invalidateQueries({ queryKey: ["tickets", newSwimlaneId.current] });
        }
    },
        {
            loading: "Moving ticket...",
            success: "Ticket moved successfully!",
            error: (error) => `Failed to move ticket: ${error instanceof Error ? error.message : "Unknown error"}`,
        });
}
