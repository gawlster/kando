import { doesLoggedInUserOwnSwimlane } from "@/utils/auth"
import { supabase } from "@/utils/supabase"
import { NextApiRequest, NextApiResponse } from "next"

export type BodyType = { id: number }
export type ResponseType = void
export const url = "/api/deleteSwimlane"

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

    const doesUserOwnSwimlane = await doesLoggedInUserOwnSwimlane(req, body.id)
    if (!doesUserOwnSwimlane) {
        return res.status(401).json({ error: "Unauthorized" })
    }

    try {
        const { error: swimlaneError } = await supabase.from("swimlane").delete().eq("id", body.id)
        if (swimlaneError) {
            return res.status(400).json({ error: swimlaneError.message })
        }
        return res.status(200).json()
    } catch (error) {
        return res.status(400).json({ error: (error as Error).message })
    }
}

function isValidBody(body: BodyType): body is BodyType {
    return (
        typeof body.id === "number" && body.id >= 0
    )
}
