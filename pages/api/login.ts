import { supabase } from "@/utils/supabase";
import { NextApiRequest, NextApiResponse } from "next";

export type BodyType = {
    username: string;
    password: string;
}
export type ResponseType = void
export const url = "/api/login"

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
    const { data, error } = await supabase.from("user").select("*").eq("username", body.username).eq("passwordHash", body.password)
    if (error) {
        return res.status(400).json({ error: error.message })
    }
    if (!data || data.length === 0) {
        return res.status(400).json({ error: "Invalid username or password" })
    }
    const user = data[0]
    res.setHeader("Set-Cookie", `auth=${user.id}; Path=/; SameSite=Strict; Secure`)
    return res.status(200).json()
}

function isValidBody(body: BodyType): body is BodyType {
    return (
        typeof body.username === "string" &&
        typeof body.password === "string"
    )
}
