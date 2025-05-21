import { NextApiRequest } from "next";
import { supabase } from "./supabase";
import jwt from "jsonwebtoken";

export function createToken(userId: number) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT secret is not defined");
    }
    const payload = { userId };
    const options = { expiresIn: "1h" } as jwt.SignOptions;
    const token = jwt.sign(payload, secret as string, options);
    return token;
}

function getUserIdFromToken(token: string) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT secret is not defined");
    }
    try {
        const decoded = jwt.verify(token, secret as string) as { userId: number };
        return decoded.userId;
    } catch (error) {
        return null;
    }
}

export async function getLoggedInUser(req: NextApiRequest) {
    const token = req.cookies["auth"];
    if (!token) {
        return null;
    }
    const userId = await getUserIdFromToken(token);
    if (!userId) {
        return null;
    }
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
