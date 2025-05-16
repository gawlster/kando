import { Database } from "@/database/supabase";
import { supabase } from "@/utils/supabase";
import { NextApiRequest, NextApiResponse } from "next";

export type ResponseType = Database["public"]["Tables"]["swimlane"]["Row"][]

export const url = "http://localhost:3000/api/getSwimlanes"

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType | { error: string }>) {
    const { data, error } = await supabase.from("swimlane").select("*")
    if (error) {
        return res.status(400).json({ error: error.message })
    }
    if (!data) {
        return res.status(400).json({ error: "No data found" })
    }
    return res.status(200).json(data)
}
