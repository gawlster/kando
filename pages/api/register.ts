import { createToken, hashPassword } from "@/utils/auth";
import { supabase } from "@/utils/supabase";
import { NextApiRequest, NextApiResponse } from "next";

export type BodyType = {
    username: string;
    password: string;
    confirmPassword: string;
}
export type ResponseType = {}
export const url = "/api/register"

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
    if (body.password !== body.confirmPassword) {
        return res.status(400).json({ error: "Passwords must match" })
    }

    const { data: existingUser } = await supabase.from("user").select("*").eq("username", body.username).single()
    if (existingUser) {
        return res.status(400).json({ error: "Username already exists" })
    }

    const passwordHash = await hashPassword(body.password)

    const { data: newUser, error } = await supabase.from("user").insert({
        username: body.username,
        passwordHash
    }).select("*").single()
    if (error) {
        return res.status(400).json({ error: error.message })
    }
    if (!newUser) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    const token = createToken(newUser.id)
    res.setHeader("Set-Cookie", `auth=${token}; Path=/; SameSite=Strict; Secure`)
    return res.status(200).json({})
}

function isValidBody(body: BodyType): body is BodyType {
    return (
        typeof body.username === "string" &&
        typeof body.password === "string" &&
        typeof body.confirmPassword === "string"
    )
}
