import { Database } from "@/database/supabase";
import { supabase } from "@/utils/supabase";
import { NextApiRequest, NextApiResponse } from "next";

export type ResponseType = Database["public"]["Tables"]["ticket"]["Row"][];
export const url = "/api/getTickets";

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType | { error: string }>) {
    const { swimlaneId } = req.query;
    if (!swimlaneId || typeof swimlaneId !== "string" || isNaN(Number(swimlaneId))) {
        return res.status(400).json({ error: "No swimlaneId in query params" });
    }
    const { data, error } = await supabase.from("ticket").select("*").eq("swimlaneId", Number(swimlaneId));
    if (error) {
        return res.status(400).json({ error: error.message })
    }
    if (!data) {
        return res.status(400).json({ error: "No data found" })
    }
    return res.status(200).json(data)
}
