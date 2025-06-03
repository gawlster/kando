import { doesLoggedInUserOwnSwimlane } from "@/utils/auth"
import { supabase } from "@/utils/supabase"
import { NextApiRequest, NextApiResponse } from "next"

export type BodyType = {
    swimlaneId: number;
    tickets: { id: number }[];
}
export type ResponseType = {}
export const url = "/api/sortTickets"

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

    try {
        const { data: existingTickets, error: existingTicketsError } = await supabase.from("ticket").select("id").eq("swimlaneId", body.swimlaneId)
        if (existingTicketsError || !existingTickets) {
            return res.status(400).json({ error: existingTicketsError?.message || "Failed to fetch existing tickets" })
        }
        if (existingTickets.length !== body.tickets.length) {
            return res.status(400).json({ error: "Number of tickets does not match" })
        }
        for (const ticket of body.tickets) {
            if (!existingTickets.some(t => t.id === ticket.id)) {
                return res.status(400).json({ error: `Ticket with id ${ticket.id} does not exist in swimlane ${body.swimlaneId}` })
            }
        }
        body.tickets.forEach(async (ticket, index) => {
            await supabase.from("ticket").update({ sortOrder: index * 10 + 10 }).eq("id", ticket.id)
        })
        return res.status(200).json({})
    } catch (error) {
        return res.status(400).json({ error: (error as Error).message })
    }
}

function isValidBody(ticket: BodyType): ticket is BodyType {
    return (
        typeof ticket.swimlaneId === "number" &&
        Array.isArray(ticket.tickets) &&
        ticket.tickets.every(t => typeof t.id === "number")
    )
}
