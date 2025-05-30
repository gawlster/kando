import { doesLoggedInUserOwnSwimlane, getLoggedInUser } from "@/utils/auth"
import { supabase } from "@/utils/supabase"
import { NextApiRequest, NextApiResponse } from "next"

export type BodyType = { id: number, direction: "left" | "right" }
export type ResponseType = void
export const url = "/api/moveSwimlane"

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

    const doesUserOwnSwimlane = await doesLoggedInUserOwnSwimlane(req, body.id)
    if (!doesUserOwnSwimlane) {
        return res.status(401).json({ error: "Unauthorized" })
    }

    let resetOrders = false;
    try {
        const { data: currentSwimlane, error: currentSwimlaneError } = await supabase.from("swimlane").select("sortOrder, userId").eq("id", body.id).single()
        if (!currentSwimlane || currentSwimlaneError) {
            return res.status(400).json({ error: currentSwimlaneError?.message || "Failed to fetch current swimlane" })
        }
        if (body.direction === "left") {
            const { data: leftSwimlanes, error: leftSwimlanesError } = await supabase
                .from("swimlane")
                .select("sortOrder")
                .eq("userId", currentSwimlane.userId!)
                .lt("sortOrder", currentSwimlane.sortOrder)
                .order("sortOrder", { ascending: false })
            if (!leftSwimlanes || leftSwimlanesError) {
                return res.status(400).json({ error: leftSwimlanesError?.message || "Failed to fetch swimlanes" })
            }
            if (leftSwimlanes.length == 0) {
                // No swimlanes to the left, do nothing
            } else if (leftSwimlanes.length === 1) {
                const otherOrder = leftSwimlanes[0].sortOrder;
                if (otherOrder < 0.001) {
                    resetOrders = true;
                }
                const newOrder = otherOrder - otherOrder * 0.1;
                await supabase.from("swimlane").update({ sortOrder: newOrder }).eq("id", body.id);
            } else {
                const lowerOrder = leftSwimlanes[0].sortOrder;
                const higherOrder = leftSwimlanes[1].sortOrder;
                const difference = higherOrder - lowerOrder;
                if (difference < 0.001) {
                    resetOrders = true;
                }
                const newOrder = lowerOrder + difference / 2;
                await supabase.from("swimlane").update({ sortOrder: newOrder }).eq("id", body.id);
            }
        } else {
            const { data: rightSwimlanes, error: rightSwimlanesError } = await supabase
                .from("swimlane")
                .select("sortOrder")
                .eq("userId", currentSwimlane.userId!)
                .gt("sortOrder", currentSwimlane.sortOrder)
                .order("sortOrder", { ascending: true })
            if (!rightSwimlanes || rightSwimlanesError) {
                return res.status(400).json({ error: rightSwimlanesError?.message || "Failed to fetch swimlanes" })
            }
            if (rightSwimlanes.length == 0) {
                // No swimlanes to the right, do nothing
            } else if (rightSwimlanes.length === 1) {
                const otherOrder = rightSwimlanes[0].sortOrder;
                const newOrder = otherOrder + otherOrder * 0.1;
                await supabase.from("swimlane").update({ sortOrder: newOrder }).eq("id", body.id);
            } else {
                const lowerOrder = rightSwimlanes[0].sortOrder;
                const higherOrder = rightSwimlanes[1].sortOrder;
                const difference = higherOrder - lowerOrder;
                if (difference < 0.001) {
                    resetOrders = true;
                }
                const newOrder = lowerOrder + difference / 2;
                await supabase.from("swimlane").update({ sortOrder: newOrder }).eq("id", body.id);
            }
        }
        if (resetOrders) {
            const { data: allSwimlanes, error: allSwimlanesError } = await supabase
                .from("swimlane")
                .select("id")
                .eq("userId", currentSwimlane.userId!)
                .order("sortOrder", { ascending: true });
            if (!allSwimlanes || allSwimlanesError) {
                return res.status(400).json({ error: allSwimlanesError?.message || "Failed to fetch swimlanes" })
            }
            const updates = allSwimlanes.map((swimlane, index) => ({
                id: swimlane.id,
                sortOrder: index * 10 + 10
            }));
            await supabase.from("swimlane").upsert(updates);
        }
        return res.status(200).json()
    } catch (error) {
        return res.status(400).json({ error: (error as Error).message })
    }
}

function isValidBody(body: BodyType): body is BodyType {
    return (
        typeof body.id === "number" &&
        typeof body.direction === "string" &&
        (body.direction === "left" || body.direction === "right")
    )
}
