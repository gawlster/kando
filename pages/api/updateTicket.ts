import { Database } from "@/database/supabase"
import { doesLoggedInUserOwnSwimlane } from "@/utils/auth"
import { supabase } from "@/utils/supabase"
import { NextApiRequest, NextApiResponse } from "next"

export type BodyType = Database["public"]["Tables"]["ticket"]["Row"] & { tagIds: number[] }
export type ResponseType = void
export const url = "/api/updateTicket"

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType | { error: string }>) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" })
    }
    const body: BodyType = req.body
    if (!body) {
        return res.status(400).json({ error: "No body in request" })
    }
    if (!isValidTicket(body)) {
        return res.status(400).json({ error: "Invalid body" })
    }

    const doesUserOwnSwimlane = await doesLoggedInUserOwnSwimlane(req, body.swimlaneId || -1)
    if (!doesUserOwnSwimlane) {
        return res.status(401).json({ error: "Unauthorized" })
    }

    const { tagIds, ...ticketData } = body;

    try {
        await supabase.from("ticket").update(ticketData).eq("id", body.id)
        const { data: ticketTagData, error: ticketTagError } = await supabase.from("ticketTag").select("tagId").eq("ticketId", body.id)
        if (!ticketTagData || ticketTagError) {
            return res.status(400).json({ error: ticketTagError.message })
        }
        const existingTagIds = new Set<number>();
        ticketTagData.forEach(tag => {
            if (tag.tagId) {
                existingTagIds.add(tag.tagId);
            }
        });
        body.tagIds.forEach(async (tagId) => {
            if (!existingTagIds.has(tagId)) {
                await supabase.from("ticketTag").insert({
                    ticketId: body.id,
                    tagId: tagId
                })
            }
        })
        existingTagIds.forEach(async (tagId) => {
            if (!body.tagIds.includes(tagId)) {
                await supabase.from("ticketTag").delete().eq("ticketId", body.id).eq("tagId", tagId)
            }
        })
        return res.status(200).json()
    } catch (error) {
        return res.status(400).json({ error: (error as Error).message })
    }
}

function isValidTicket(ticket: BodyType): ticket is BodyType {
    return (
        typeof ticket.id === "number" &&
        typeof ticket.title === "string" &&
        typeof ticket.description === "string" &&
        typeof ticket.swimlaneId === "number" &&
        typeof ticket.created_at === "string" &&
        typeof ticket.dueDate === "string" &&
        typeof ticket.startDate === "string" &&
        Array.isArray(ticket.tagIds) &&
        ticket.tagIds.every(tagId => typeof tagId === "number" && tagId >= 0)
    )
}
