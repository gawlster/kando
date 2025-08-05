import { useMutation, UseMutationOptions, UseMutationResult } from "@tanstack/react-query";
import { useRef } from "react";
import { toast } from "react-hot-toast";

type ToastOptions = {
    loading: string;
    success: string;
    error: string | ((error: unknown) => string);
};

export function useToastMutation<
    TData = unknown,
    TError = unknown,
    TVariables = void,
    TContext = unknown,
>(
    options: UseMutationOptions<TData, TError, TVariables, TContext>,
    toastMessages: ToastOptions
): UseMutationResult<TData, TError, TVariables, TContext> {
    const toastId = useRef("");

    const mutation = useMutation<TData, TError, TVariables, TContext>({
        ...options,
        onMutate: async (variables) => {
            toastId.current = toast.loading(toastMessages.loading);
            if (options.onMutate) {
                return await options.onMutate(variables);
            }
            return undefined;
        },
        onSuccess: (data, variables, context) => {
            if (toastId.current) toast.success(toastMessages.success, { id: toastId.current });
            options.onSuccess?.(data, variables, context);
        },
        onError: (error, variables, context) => {
            const message =
                typeof toastMessages.error === "function"
                    ? toastMessages.error(error)
                    : toastMessages.error;
            if (toastId.current) toast.error(message, { id: toastId.current });
            options.onError?.(error, variables, context);
        },
        onSettled: (data, error, variables, context) => {
            // Optional: toast.dismiss(toastId);
            options.onSettled?.(data, error, variables, context);
        },
    });

    return mutation;
}
