import { NextApiRequest } from "next";
import { supabase } from "./supabase";

export async function getLoggedInUser(req: NextApiRequest) {
    const userCookie = req.cookies["auth"];
    if (!userCookie || isNaN(Number(userCookie))) {
        return null;
    }
    const userId = Number(userCookie);
    const { data, error } = await supabase.from("user").select("*").eq("id", userId).single();
    if (error || !data) {
        return null;
    }
    return data;
}

export async function doesLoggedInUserOwnSwimlane(req: NextApiRequest, swimlaneId: number) {
    const user = await getLoggedInUser(req);
    if (!user) {
        return false;
    }
    const { data, error } = await supabase.from("swimlane").select("*").eq("id", swimlaneId).eq("userId", user.id).single();
    if (error || !data) {
        return false;
    }
    return true;
}
