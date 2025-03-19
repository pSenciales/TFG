"use client"
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner"
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MagicCard } from "@/components/magicui/magic-card";
import Divider from "@mui/material/Divider";
import { signIn } from "next-auth/react";
import Image from 'next/image'

import ReCAPTCHA from "react-google-recaptcha";

export default function Register() {
    const FLASK_URL = process.env.NEXT_PUBLIC_FLASK_API_URL;

    const [email, setEmail] = useState("");
    const [repeatEmail, setRepeatEmail] = useState("");

    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");

    const [name, setName] = useState("")

    const [birthday, setBirthday] = useState("")
    const [isOldEnough, setIsOldEnough] = useState(false);

    const [otp, setOtp] = useState("");
    const [otpToken, setOtpToken] = useState("");
    const [step, setStep] = useState(1);

    const [counter, setCounter] = useState(60);
    const [disabled, setDisabled] = useState(true);
    const [disabledEmail, setDisabledEmail] = useState(true);
    const [disabledPw, setDisabledPw] = useState(true);

    const [passwordCheck, setPasswordCheck] = useState("");


    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const recaptchaRef = useRef<ReCAPTCHA>(null);
    const [isVerified, setIsVerified] = useState(false);
    const [captchaToken, setCaptchaToken] = useState("");
    const [captchaJWT, setCaptchaJWT] = useState("");


    useEffect(() => {
        if (counter === 0) {
            setDisabled(false);
            return;
        }
        const timer = setInterval(() => {
            setCounter((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [counter]);

    const handleSendEmail = async (captchaTokenGenerated: string | null, captchaJWT: string | null) => {
        const { data } = await axios.post("/api/send-email/otp/send", { to: email, captchaRecibed: captchaTokenGenerated, captchaJWT: captchaJWT});
        setOtpToken(data.token);
        if(data.captchaJWT) setCaptchaJWT(data.captchaJWT);
        setCounter(60);
        setDisabled(true);
    };

    const handleContinue = async (captchaTokenGenerated: string | null) => {
        setDisabled(true)
        setLoading(true);
        try {
            const response = await axios.get(`${FLASK_URL}/users/email/${email}`);
            console.log(response.data);
            if (response.data.success === "User found") {

                toast.warning("Email already in use", {
                    description: `${email} is already registered, try to log in here`,
                    action: {
                        label: "LogIn",
                        onClick: () => {
                            window.location.href = "/login";
                        },
                    },
                });
                setIsVerified(false);
                setCaptchaToken("");
                if (recaptchaRef.current) {
                    recaptchaRef.current.reset();
                }
            } else if (response.data.success === "User not found") {
                await handleSendEmail(captchaTokenGenerated, null);
                setStep(3);
            }
        } catch (error: unknown) {
            console.error("Unexpected error:", error);
        } finally {
            setLoading(false);
        }


    };


    const handleVerify = async () => {
        try {
            const { status } = await axios.post("/api/send-email/otp/verify", {
                token: otpToken,
                mail: email,
                otp: otp
            });
            if (status === 200) {
                setError("");
                setStep(4);
            }
        } catch (err: unknown) {
            if (axios.isAxiosError(err) && err.response && err.response.status === 400) {
                console.log(err.response);
                setError("The code entered is incorrect or expired.");
            } else {
                setError("An error occurred. Please try again later.");
            }
        }
    };


    const handleBirthdayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBirthday(e.target.value);
        const birthDate = new Date(e.target.value);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        setIsOldEnough(age >= 16);
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newEmail = e.target.value;
        setEmail(newEmail);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (emailRegex.test(newEmail)) {
            setDisabledEmail(false);
        } else {
            setDisabledEmail(true);
        }
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;

        if (passwordRegex.test(newPassword)) {
            setDisabledPw(false)
            setPasswordCheck("")
        } else {
            setDisabledPw(true)
            setPasswordCheck("At least 8 characters.\nAt least one uppercase letter.\nAt least one lowercase letter.\nAt least one special character (e.g., !@#$%^&*).");

        }
    }




    const handleCreateAccount = async () => {
        await axios.post(`${FLASK_URL}/users`, { name, password, email, captchaJWT, captchaToken});
        signIn("credentials", {
            email: email,
            password: password
        })
    }

    const handleChange = (token: string | null) => {
        setIsVerified(true);
        setCaptchaToken(token || "");
    };

    function handleExpired() {
        setIsVerified(false);
    }


    return (
        <div className="h-full">
            <h1 className="text-center text-3xl font-bold mt-20">Sign Up to Fairplay360</h1>
            <Card className="max-w-xl mx-auto mt-10">
                <MagicCard gradientColor="#D9D9D955">
                    <CardHeader />
                    <CardContent>
                        {step === 1 && (
                            <div>
                                <div className="grid gap-4">
                                    <Button
                                        variant="outline"
                                        onClick={() => signIn("google")}
                                        className="flex items-center justify-center gap-2 text-lg"
                                    >
                                        <Image src="/google-icon.svg" alt="Google Logo" width="24" height="24" />
                                        Sign up with Google
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => signIn("github")}
                                        className="flex items-center justify-center gap-2 text-lg mt-5"
                                    >
                                        <Image src="/github-mark.svg" alt="GitHub Logo" width="24" height="24" />
                                        Sign up with GitHub
                                    </Button>
                                    <Divider className="my-10">OR</Divider>
                                    <Button
                                        className="flex items-center justify-center gap-2 text-lg"
                                        onClick={() => { setStep(2); console.log(process.env.NEXT_PUBLIC_RECAPTCHA) }}
                                    >
                                        <Image src="/email.png" alt="Email logo" width="24" height="24" />
                                        Sign up with email
                                    </Button>
                                </div>
                            </div>
                        )}
                        {step === 2 && (
                            <div>
                                <Button variant="ghost" className="pl-0 mb-5 text-md" onClick={() => setStep(1)}>
                                    <Image alt="mail icon" src="/left-arrow.svg" width="20" height="20" /> All sign up options
                                </Button>
                                <div className="grid gap-5">
                                    <div>
                                        <Label>Email</Label>
                                        <Input type="email" placeholder="example@mail.com" onChange={handleEmailChange} />
                                    </div>
                                    <div>
                                        <Label>Repeat email</Label>
                                        <Input type="email" placeholder="example@mail.com" onChange={(e) => setRepeatEmail(e.target.value)} />
                                    </div>
                                    <div>
                                        <Label>Password</Label>
                                        <Input type="password" placeholder="password" onChange={handlePasswordChange} />
                                        <span className="text-red-500 text-xs">{passwordCheck}</span>
                                    </div>

                                    <div>
                                        <Label>Repeat password</Label>
                                        <Input type="password" placeholder="password" onChange={(e) => setRepeatPassword(e.target.value)} />
                                    </div>
                                    <ReCAPTCHA
                                        className="mx-auto"
                                        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA || ""}
                                        ref={recaptchaRef}
                                        onChange={handleChange}
                                        onExpired={handleExpired}
                                    />
                                    {email === repeatEmail && password === repeatPassword ? (
                                        <Button
                                            className="mt-5"
                                            disabled={loading || disabledEmail || disabledPw || !isVerified}
                                            onClick={() => handleContinue(captchaToken)}
                                        >
                                            {loading ? (
                                                <span className="flex items-center">
                                                    <svg
                                                        className="animate-spin h-5 w-5 mr-2 text-white"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <circle
                                                            className="opacity-25"
                                                            cx="12"
                                                            cy="12"
                                                            r="10"
                                                            stroke="currentColor"
                                                            strokeWidth="4"
                                                        ></circle>
                                                        <path
                                                            className="opacity-75"
                                                            fill="currentColor"
                                                            d="M4 12a8 8 0 018-8v8H4z"
                                                        ></path>
                                                    </svg>
                                                </span>
                                            ) : (
                                                "Continue with email"
                                            )}
                                        </Button>
                                    ) : (
                                        <Button disabled variant="destructive" className="mt-5">
                                            {email !== repeatEmail && <p>Emails do not match.</p>}
                                            {password !== repeatPassword && <p>Passwords do not match.</p>}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )}
                        {step === 3 && (
                            <div className="grid justify-center">
                                <h1 className="text-md">You should have received a code in your mail!</h1>
                                <div className="grid justify-center mt-20 mb-10">
                                    <InputOTP
                                        maxLength={6}
                                        pattern={REGEXP_ONLY_DIGITS}
                                        onChange={(value) => setOtp(value)}
                                    >
                                        <InputOTPGroup>
                                            <InputOTPSlot index={0} />
                                            <InputOTPSlot index={1} />
                                            <InputOTPSlot index={2} />
                                        </InputOTPGroup>
                                        <InputOTPSeparator />
                                        <InputOTPGroup>
                                            <InputOTPSlot index={3} />
                                            <InputOTPSlot index={4} />
                                            <InputOTPSlot index={5} />
                                        </InputOTPGroup>
                                    </InputOTP>
                                </div>
                                {error && <div className="text-red-500 text-center mb-2">{error}</div>}
                                <Button onClick={async () => await handleVerify()}>Verify</Button>
                            </div>
                        )}



                        {step === 4 && (
                            <div className="grid gap-4">
                                <h1 className="text-md mb-5">Complete your profile</h1>
                                <Label>Name</Label>
                                <Input
                                    required
                                    type="text"
                                    placeholder="Jhon Smith"
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <Label>Date of birth</Label>
                                <Input required type="date" onChange={handleBirthdayChange} />
                                {!isOldEnough && birthday && (
                                    <div className="text-red-500 text-sm">
                                        You must be at least 16 years old.
                                    </div>
                                )}
                                <Button className="mt-10"
                                    disabled={!isOldEnough || birthday === "" || name === ""}
                                    onClick={handleCreateAccount}>
                                    Create account
                                </Button>
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="grid">
                        {step === 2 && (
                            <span className="text-silver">
                                By continuing, you agree to the{" "}
                                <a className="text-blue underline" href="/account-agreetment">
                                    Account agreetment
                                </a>
                            </span>
                        )}
                        {step < 3 && (
                            <span className="text-silver">
                                Already have an account,{" "}
                                <a className="text-blue underline" href="/login">
                                    Log In here
                                </a>
                            </span>
                        )}
                        {step === 3 && (
                            <span className="text-silver">
                                The code can take a few minutes to send.{" "}
                                <Button
                                    variant="ghost"
                                    className="w-min ml-0 text-blue"
                                    disabled={disabled}
                                    onClick={async ()=>  await handleSendEmail(captchaToken, captchaJWT)}
                                >
                                    Resend code? {disabled && `(${counter}s)`}
                                </Button>
                            </span>
                        )}
                    </CardFooter>
                </MagicCard>
            </Card>
        </div>
    );
}
