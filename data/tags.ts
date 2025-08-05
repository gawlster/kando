import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
    type ResponseType as GetAllUserTagsResponse,
    url as getAllUserTagsUrl
} from "../pages/api/getAllUserTags";
import {
    type BodyType as CreateTagBody,
    type ResponseType as CreateTagResponse,
    url as createTagUrl
} from "../pages/api/createTag";
import { useToastMutation } from "@/hooks/useToastMutation";
import { getAndThrowError } from "@/utils/dataUtils";

export function useAllUserTags() {
    return useQuery<GetAllUserTagsResponse, Error>({
        queryKey: ["allUserTags"],
        queryFn: async () => {
            const res = await fetch(getAllUserTagsUrl);
            if (!res.ok) throw new Error("Failed to fetch tags");
            return res.json();
        }
    });
}

export function useCreateTag() {
    const queryClient = useQueryClient();
    return useToastMutation<
        CreateTagResponse,
        Error,
        CreateTagBody
    >({
        mutationKey: ["createTag"],
        mutationFn: async (body) => {
            const res = await fetch(createTagUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            if (!res.ok) {
                await getAndThrowError(res, "Failed to create tag");
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["allUserTags"] });
        }
    },
        {
            loading: "Creating tag...",
            success: "Tag created successfully!",
            error: (error) => `Failed to create tag: ${error instanceof Error ? error.message : "Unknown error"}`,
        });
}
