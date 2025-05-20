import { Database } from "@/database/supabase"
import { supabase } from "@/utils/supabase"
import { NextApiRequest, NextApiResponse } from "next"

export type BodyType = Database["public"]["Tables"]["ticket"]["Row"]
export type ResponseType = void
export const url = "http://localhost:3000/api/updateTicket"

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
    try {

        await supabase.from("ticket").update(body).eq("id", body.id)
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
        typeof ticket.startDate === "string"
    )
}
