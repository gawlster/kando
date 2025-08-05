import React, { useCallback, useState } from "react";
import { Button, Card, CardBody, CardHeader, Divider, Input } from "@heroui/react";
import { useEnter } from "@/hooks/useEnter";
import { useLogin, useRegister } from "@/data/auth";

export function LoggedOut() {
    const [visibleForm, setVisibleForm] = useState<"login" | "register">("login")
    const switchToLogin = useCallback(() => {
        setVisibleForm("login")
    }, [])
    const switchToRegister = useCallback(() => {
        setVisibleForm("register")
    }, [])
    return (
        <div className="w-screen min-h-screen flex items-center justify-center">
            <Card className="max-w-[400px] w-[80%] mx-auto p-4 m-4">
                <CardHeader>
                    <h1 className="text-2xl font-bold">{visibleForm === "login" ? "Log in to continue" : "Register for Kando"}</h1>
                </CardHeader>
                <Divider />
                <CardBody>
                    <div className="flex flex-col gap-2 pt-2">
                        {
                            visibleForm === "login" ? (
                                <LoginForm switchToRegister={switchToRegister} />
                            ) : (
                                <RegisterForm switchToLogin={switchToLogin} />
                            )
                        }
                    </div>
                </CardBody>
            </Card>
        </div>
    )
}

function RegisterForm({ switchToLogin }: { switchToLogin: () => void }) {
    const { mutateAsync: doRegister, isPending: registerPending } = useRegister();
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const handleSubmitPress = useCallback(async () => {
        try {
            await doRegister({
                username,
                password,
                confirmPassword
            })
        } catch (_) {
            // do nothing, handled in the hook
        }
    }, [
        username,
        password,
        confirmPassword,
        doRegister
    ])
    useEnter(handleSubmitPress);
    return (
        <>
            <Input
                label="Username"
                labelPlacement="inside"
                name="username"
                value={username}
                onValueChange={setUsername}
            />
            <Input
                label="Password"
                labelPlacement="inside"
                name="password"
                value={password}
                onValueChange={setPassword}
                type="password"
            />
            <Input
                label="Confirm Password"
                labelPlacement="inside"
                name="confirmPassword"
                value={confirmPassword}
                onValueChange={setConfirmPassword}
                type="password"
            />
            <div className="flex gap-2 items-end justify-between">
                <span className="text-sm text-gray-500 cursor-pointer" onClick={switchToLogin}>
                    Login instead?
                </span>
                <Button className="mt-2" onPress={handleSubmitPress} isLoading={registerPending}>{registerPending ? "Loading..." : "Submit"}</Button>
            </div>
        </>
    )
}

function LoginForm({ switchToRegister }: { switchToRegister: () => void }) {
    const { mutateAsync: doLogin, isPending: loginPending } = useLogin();
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const handleSubmitPress = useCallback(async () => {
        try {
            await doLogin({
                username,
                password
            })
        } catch (_) {
            // do nothing, handled in the hook
        }
    }, [
        username,
        password,
        doLogin
    ])
    useEnter(handleSubmitPress);
    return (
        <>
            <Input
                label="Username"
                labelPlacement="inside"
                name="username"
                value={username}
                onValueChange={setUsername}
            />
            <Input
                label="Password"
                labelPlacement="inside"
                name="password"
                value={password}
                onValueChange={setPassword}
                type="password"
            />
            <div className="flex gap-2 items-end justify-between">
                <span className="text-sm text-gray-500 cursor-pointer" onClick={switchToRegister}>
                    Register instead?
                </span>
                <Button className="mt-2" onPress={handleSubmitPress} isLoading={loginPending}>{loginPending ? "Loading..." : "Submit"}</Button>
            </div>
        </>
    )
}
