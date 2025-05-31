import { Database } from "@/database/supabase"
import { doesLoggedInUserOwnSwimlane } from "@/utils/auth"
import { supabase } from "@/utils/supabase"
import { NextApiRequest, NextApiResponse } from "next"

export type BodyType = Omit<Database["public"]["Tables"]["ticket"]["Row"], "created_at" | "id"> & { tagIds: number[] }
export type ResponseType = void
export const url = "/api/addTicket"

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType | { error: string }>) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" })
    }
    const body: BodyType = req.body
    if (!body) {
        return res.status(400).json({ error: "No body in request" })
    }
    if (!isValidBody(body)) {
        return res.status(400).json({ error: "Invalid body" })
    }

    const doesUserOwnSwimlane = await doesLoggedInUserOwnSwimlane(req, body.swimlaneId || -1)
    if (!doesUserOwnSwimlane) {
        res.setHeader("Set-Cookie", "auth=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax")
        return res.status(401).json({ error: "Unauthorized" })
    }

    const { tagIds, ...ticketData } = body;

    try {
        const { data: newTicketId, error } = await supabase.from("ticket").insert(ticketData).select("id").single()
        if (!newTicketId || error) {
            return res.status(400).json({ error: error?.message || "Failed to create ticket" })
        }
        tagIds.forEach(async (tagId) => {
            await supabase.from("ticketTag").insert({
                ticketId: newTicketId.id,
                tagId: tagId
            })
        })
        return res.status(200).json()
    } catch (error) {
        return res.status(400).json({ error: (error as Error).message })
    }
}

function isValidBody(body: BodyType): body is BodyType {
    return (
        typeof body.title === "string" &&
        typeof body.description === "string" &&
        typeof body.startDate === "string" &&
        typeof body.dueDate === "string" &&
        typeof body.swimlaneId === "number" &&
        Array.isArray(body.tagIds) &&
        body.tagIds.every(tagId => typeof tagId === "number" && tagId >= 0)
    )
}
