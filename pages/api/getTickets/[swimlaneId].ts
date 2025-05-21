import { Database } from "@/database/supabase";
import { doesLoggedInUserOwnSwimlane } from "@/utils/auth";
import { supabase } from "@/utils/supabase";
import { NextApiRequest, NextApiResponse } from "next";

export type ResponseType = Database["public"]["Tables"]["ticket"]["Row"][];
export const url = "/api/getTickets";

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType | { error: string }>) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }
    const { swimlaneId } = req.query;
    if (!swimlaneId || typeof swimlaneId !== "string" || isNaN(Number(swimlaneId))) {
        return res.status(400).json({ error: "No swimlaneId in query params" });
    }

    const doesUserOwnSwimlane = await doesLoggedInUserOwnSwimlane(req, Number(swimlaneId));
    if (!doesUserOwnSwimlane) {
        return res.status(401).json({ error: "Unauthorized" });
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
