import { Database } from "@/database/supabase"
import { getLoggedInUser } from "@/utils/auth"
import { supabase } from "@/utils/supabase"
import { NextApiRequest, NextApiResponse } from "next"

export type BodyType = Omit<Database["public"]["Tables"]["tag"]["Row"], "created_at" | "id" | "userId" | "color">
export type ResponseType = {}
export const url = "/api/createTag"

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

    const user = await getLoggedInUser(req)
    if (!user) {
        res.setHeader("Set-Cookie", "auth=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax")
        return res.status(401).json({ error: "Unauthorized" })
    }

    try {
        await supabase.from("tag").insert({
            title: body.title,
            userId: user.id,
            color: "#808080"
        })
        return res.status(200).json({})
    } catch (error) {
        return res.status(400).json({ error: (error as Error).message })
    }
}

function isValidBody(body: BodyType): body is BodyType {
    return (
        typeof body.title === "string"
    )
}
