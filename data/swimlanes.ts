import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { useRef } from "react";

export function useSwimlanes() {
    return useQuery<GetSwimlanesResponse, Error>({
        queryKey: ["swimlanes"],
        queryFn: async () => {
            const res = await fetch(getSwimlanesUrl);
            if (!res.ok) throw new Error("Failed to fetch swimlanes");
            return res.json();
        }
    });
}

export function useAddSwimlane() {
    const queryClient = useQueryClient();
    return useMutation<
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
                throw new Error("Failed to add swimlane");
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["swimlanes"] });
        }
    });
}

export function useMoveSwimlane() {
    const queryClient = useQueryClient();
    return useMutation<
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
                throw new Error("Failed to move swimlane");
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["swimlanes"] });
        }
    });
}

export function useSortTickets(swimlaneId: number) {
    const queryClient = useQueryClient();
    return useMutation<
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
                throw new Error("Failed to sort tickets");
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tickets", swimlaneId] });
        }
    });
}

export function useDeleteSwimlane() {
    const queryClient = useQueryClient();
    return useMutation<
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
                throw new Error("Failed to delete swimlane");
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["swimlanes"] });
        }
    });
}
