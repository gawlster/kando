import { getAndThrowError } from "@/utils/dataUtils";
import {
    type BodyType as LoginBody,
    type ResponseType as LoginResponse,
    url as loginUrl
} from "../pages/api/login";
import {
    type BodyType as RegisterBody,
    type ResponseType as RegisterResponse,
    url as registerUrl
} from "../pages/api/register";
import { useToastMutation } from "@/hooks/useToastMutation";

export function useLogin() {
    return useToastMutation<
        LoginResponse,
        Error,
        LoginBody
    >({
        mutationKey: ["login"],
        mutationFn: async (body) => {
            const res = await fetch(loginUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            if (!res.ok) {
                await getAndThrowError(res, "Failed to log in");
            }
            return res.json();
        },
    },
        {
            loading: "Logging in...",
            success: "Login successful!",
            error: (error) => `Login failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        });
}

export function useRegister() {
    return useToastMutation<
        RegisterResponse,
        Error,
        RegisterBody
    >({
        mutationKey: ["register"],
        mutationFn: async (body) => {
            const res = await fetch(registerUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            if (!res.ok) {
                await getAndThrowError(res, "Failed to register");
            }
            return res.json();
        },
    },
        {
            loading: "Registering...",
            success: "Registration successful! Welcome to Kando!",
            error: (error) => `Registration failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        });
}
