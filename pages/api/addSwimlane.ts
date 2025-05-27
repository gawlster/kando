import { Database } from "@/database/supabase"
import { getLoggedInUser } from "@/utils/auth"
import { supabase } from "@/utils/supabase"
import { NextApiRequest, NextApiResponse } from "next"

export type BodyType = Omit<Database["public"]["Tables"]["swimlane"]["Row"], "created_at" | "id" | "userId" | "gradientColorStart" | "gradientColorEnd">
export type ResponseType = void
export const url = "/api/addSwimlane"

const swimlaneColors = [
    {
        gradientColorStart: "#e8f1fb",
        gradientColorEnd: "#dbeeff",
    },
    {
        gradientColorStart: "#f1fff8",
        gradientColorEnd: "#d9f5e5",
    },
    {
        gradientColorStart: "#f8f4ff",
        gradientColorEnd: "#e9ddf9",
    }
]

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
    console.log(user)
    if (!user) {
        return res.status(401).json({ error: "Unauthorized" })
    }

    const existingSwimlanes = await supabase.from("swimlane").select("id").eq("userId", user.id)
    const numSwimlanes = existingSwimlanes.data?.length ?? 0
    const gradient = swimlaneColors[numSwimlanes % swimlaneColors.length]

    try {
        await supabase.from("swimlane").insert({
            title: body.title,
            ...gradient,
            userId: user.id,
        })
        return res.status(200).json()
    } catch (error) {
        return res.status(400).json({ error: (error as Error).message })
    }
}

function isValidBody(body: BodyType): body is BodyType {
    return (
        typeof body.title === "string"
    )
}
