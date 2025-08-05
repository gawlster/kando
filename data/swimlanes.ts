import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
    type ResponseType as GetSwimlanesResponse,
    url as getSwimlanesUrl
} from "../pages/api/getSwimlanes";
import {
    type BodyType as AddSwmlaneBody,
    type ResponseType as AddSwimlaneResponse,
    url as addSwimlaneUrl
} from "../pages/api/addSwimlane";
import {
    type BodyType as SortTicketsBody,
    type ResponseType as SortTicketsResponse,
    url as sortTicketsUrl
} from "../pages/api/sortTickets";
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
import { useToastMutation } from "@/hooks/useToastMutation";
import { getAndThrowError } from "@/utils/dataUtils";

export function useSwimlanes() {
    return useQuery<GetSwimlanesResponse, Error>({
        queryKey: ["swimlanes"],
        queryFn: async () => {
            const res = await fetch(getSwimlanesUrl);
            if (!res.ok) {
                await getAndThrowError(res, "Failed to get swimlanes")
            }
            return res.json();
        }
    });
}

export function useAddSwimlane() {
    const queryClient = useQueryClient();
    return useToastMutation<
        AddSwimlaneResponse,
        Error,
        AddSwmlaneBody
    >({
        mutationKey: ["addSwimlane"],
        mutationFn: async (newSwimlane) => {
            const res = await fetch(addSwimlaneUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newSwimlane),
            });
            if (!res.ok) {
                await getAndThrowError(res, "Failed to add swimlane");
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["swimlanes"] });
        }
    },
        {
            loading: "Adding swimlane...",
            success: "Swimlane added successfully!",
            error: (error) => `Failed to add swimlane: ${error instanceof Error ? error.message : "Unknown error"}`,
        });
}

export function useMoveSwimlane() {
    const queryClient = useQueryClient();
    return useToastMutation<
        MoveSwimlaneResponse,
        Error,
        MoveSwimlaneBody
    >({
        mutationKey: ["moveSwimlane"],
        mutationFn: async (body) => {
            const res = await fetch(moveSwimlaneUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            if (!res.ok) {
                await getAndThrowError(res, "Failed to move swimlane");
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["swimlanes"] });
        }
    },
        {
            loading: "Moving swimlane...",
            success: "Swimlane moved successfully!",
            error: (error) => `Failed to move swimlane: ${error instanceof Error ? error.message : "Unknown error"}`,
        });
}

export function useSortTickets(swimlaneId: number) {
    const queryClient = useQueryClient();
    return useToastMutation<
        SortTicketsResponse,
        Error,
        SortTicketsBody
    >({
        mutationKey: ["sortTickets", swimlaneId],
        mutationFn: async (body) => {
            const res = await fetch(sortTicketsUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            if (!res.ok) {
                await getAndThrowError(res, "Failed to sort tickets");
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tickets", swimlaneId] });
        }
    },
        {
            loading: "Sorting tickets...",
            success: "Tickets sorted successfully!",
            error: (error) => `Failed to sort tickets: ${error instanceof Error ? error.message : "Unknown error"}`,
        });
}

export function useDeleteSwimlane() {
    const queryClient = useQueryClient();
    return useToastMutation<
        DeleteSwimlaneResponse,
        Error,
        DeleteSwimlaneBody
    >({
        mutationKey: ["deleteSwimlane"],
        mutationFn: async (body) => {
            const res = await fetch(deleteSwimlaneUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            if (!res.ok) {
                await getAndThrowError(res, "Failed to delete swimlane");
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["swimlanes"] });
        }
    },
        {
            loading: "Deleting swimlane...",
            success: "Swimlane deleted successfully!",
            error: (error) => `Failed to delete swimlane: ${error instanceof Error ? error.message : "Unknown error"}`,
        });
}
