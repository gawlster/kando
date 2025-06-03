import { comparePassword, createToken } from "@/utils/auth";
import { supabase } from "@/utils/supabase";
import { NextApiRequest, NextApiResponse } from "next";

export type BodyType = {
    username: string;
    password: string;
}
export type ResponseType = {}
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
    const { data, error } = await supabase.from("user").select("*").eq("username", body.username)
    if (error) {
        return res.status(400).json({ error: error.message })
    }
    if (!data || data.length === 0) {
        return res.status(400).json({ error: "Invalid username or password" })
    }
    const user = data[0]
    const doesPasswordMatchHash = await comparePassword(body.password, user.passwordHash)
    if (!doesPasswordMatchHash) {
        return res.status(400).json({ error: "Invalid username or password" })
    }
    const token = createToken(user.id)
    res.setHeader("Set-Cookie", `auth=${token}; Path=/; SameSite=Strict; Secure`)
    return res.status(200).json({ resetAuth: true })
}

function isValidBody(body: BodyType): body is BodyType {
    return (
        typeof body.username === "string" &&
        typeof body.password === "string"
    )
}
