import { Database } from "@/database/supabase";
import { doesLoggedInUserOwnSwimlane } from "@/utils/auth";
import { supabase } from "@/utils/supabase";
import { NextApiRequest, NextApiResponse } from "next";

export type ResponseType = (Database["public"]["Tables"]["ticket"]["Row"] & {
    tagIds: string[];
})[];
export const url = "/api/getTickets";

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType | { error: string }>) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }
    const { swimlaneId } = req.query;
    if (!swimlaneId || typeof swimlaneId !== "string" || isNaN(Number(swimlaneId))) {
        return res.status(400).json({ error: "No swimlaneId in query params" });
    }

    const doesUserOwnSwimlane = await doesLoggedInUserOwnSwimlane(req, Number(swimlaneId));
    if (!doesUserOwnSwimlane) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const { data, error } = await supabase.from("ticket").select("*").eq("swimlaneId", Number(swimlaneId));
    if (error) {
        return res.status(400).json({ error: error.message })
    }
    if (!data) {
        return res.status(400).json({ error: "No data found" })
    }
    const dataWithTags = await attachTagsToTickets(data);
    return res.status(200).json(dataWithTags)
}

async function attachTagsToTickets(tickets: Database["public"]["Tables"]["ticket"]["Row"][]) {
    return await Promise.all(tickets.map(async (ticket) => {
        const { data: ticketTagData, error: ticketTagError } = await supabase.from("ticketTag").select("tagId").eq("ticketId", ticket.id);
        if (!ticketTagData || ticketTagError) {
            throw new Error(ticketTagError?.message || "No tags found for ticket");
        }
        const tagIds = new Set<string>();
        ticketTagData.forEach(tag => {
            if (tag.tagId) {
                tagIds.add(tag.tagId.toString());
            }
        });
        return {
            ...ticket,
            tagIds: Array.from(tagIds)
        };
    }));
}
