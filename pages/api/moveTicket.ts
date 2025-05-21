import { doesLoggedInUserOwnSwimlane } from "@/utils/auth";
import { supabase } from "@/utils/supabase"
import { NextApiRequest, NextApiResponse } from "next"

export type BodyType = {
    id: number;
    newSwimlaneId: number;
}
export type ResponseType = void
export const url = "/api/moveTicket"

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

    const { data: ticketData, error: ticketError } = await supabase.from("ticket").select("swimlaneId").eq("id", body.id).single()
    if (ticketError || !ticketData || !ticketData.swimlaneId) {
        return res.status(400).json({ error: "Ticket not found" })
    }
    const doesUserOwnOriginalSwimlane = await doesLoggedInUserOwnSwimlane(req, ticketData.swimlaneId)
    const doesUserOwnDestinationSwimlane = await doesLoggedInUserOwnSwimlane(req, body.newSwimlaneId || -1)
    if (!doesUserOwnOriginalSwimlane || !doesUserOwnDestinationSwimlane) {
        return res.status(401).json({ error: "Unauthorized" })
    }

    try {
        await supabase.from("ticket").update({
            swimlaneId: body.newSwimlaneId
        }).eq("id", body.id)
        return res.status(200).json()
    } catch (error) {
        return res.status(400).json({ error: (error as Error).message })
    }
}

function isValidBody(body: BodyType): body is BodyType {
    return (
        typeof body.id === "number" &&
        typeof body.newSwimlaneId === "number"
    )
}
