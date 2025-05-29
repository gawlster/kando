import { Database } from "@/database/supabase";
import { getLoggedInUser } from "@/utils/auth";
import { supabase } from "@/utils/supabase";
import { NextApiRequest, NextApiResponse } from "next";

export type ResponseType = Database["public"]["Tables"]["tag"]["Row"][]

export const url = "/api/getAllUserTags"

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType | { error: string }>) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" })
    }

    const user = await getLoggedInUser(req)
    if (!user) {
        return res.status(401).json({ error: "Unauthorized" })
    }

    const { data, error } = await supabase.from("tag").select("*").eq("userId", user.id)
    if (error) {
        return res.status(400).json({ error: error.message })
    }
    if (!data) {
        return res.status(400).json({ error: "No data found" })
    }
    return res.status(200).json(data)
}
