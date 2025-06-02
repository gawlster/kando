import { useMutation } from "@tanstack/react-query";
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

export function useLogin() {
    return useMutation<
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
                throw new Error("Failed to login");
            }
            return res.json();
        },
    });
}

export function useRegister() {
    return useMutation<
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
                throw new Error("Failed to register");
            }
            return res.json();
        },
    });
}
