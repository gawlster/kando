import React, { useCallback, useContext, useState } from "react";
import { Button, Card, CardBody, CardHeader, Divider, Input } from "@heroui/react";
import { usePost } from "@/hooks/usePost";
import {
    type BodyType as LoginPostBody,
    type ResponseType as LoginPostResponse,
    url as loginPostUrl
} from "../pages/api/login";
import {
    type BodyType as RegisterPostBody,
    type ResponseType as RegisterPostResponse,
    url as registerPostUrl
} from "../pages/api/register";
import { AuthContext } from "@/pages";

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
    const { refetchAuthCookie } = useContext(AuthContext)
    const {
        doPost: doRegister,
        loading: registerLoading,
    } = usePost<RegisterPostBody, RegisterPostResponse>(registerPostUrl, {
        successMessage: "Registered successfully! Welcome to Kando!"
    })
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const handleSubmitPress = useCallback(async () => {
        await doRegister({
            username,
            password,
            confirmPassword
        })
        refetchAuthCookie()
    }, [username, password, confirmPassword, doRegister, refetchAuthCookie])
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
                <Button className="mt-2" onPress={handleSubmitPress}>{registerLoading ? "Loading..." : "Submit"}</Button>
            </div>
        </>
    )
}

function LoginForm({ switchToRegister }: { switchToRegister: () => void }) {
    const { refetchAuthCookie } = useContext(AuthContext)
    const {
        doPost: doLogin,
        loading: loginLoading,
    } = usePost<LoginPostBody, LoginPostResponse>(loginPostUrl, {
        successMessage: "Logged in successfully"
    })
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const handleSubmitPress = useCallback(async () => {
        await doLogin({
            username,
            password
        })
        refetchAuthCookie()
    }, [username, password, doLogin, refetchAuthCookie])
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
                <Button className="mt-2" onPress={handleSubmitPress}>{loginLoading ? "Loading..." : "Submit"}</Button>
            </div>
        </>
    )
}
