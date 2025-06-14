"use client";
import { useLogin } from "@/hooks/useLogin"
import Step1 from "@/components/login/Step1"
import Step2 from "@/components/login/Step2"
import LoginFooter from "@/components/login/LoginFooter"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { MagicCard } from "@/components/magicui/magic-card";
import FadeIn from "@/components/fadeIn";
import { useTranslations } from 'next-intl';

export default function Login() {
    const t = useTranslations('login');
    const {
        email,
        password,
        step,
        errorLogin,
        disabled,
        loading,
        setStep,
        setEmail,
        setPassword,
        handleLogin
    } = useLogin();

    return (
        <div className="h-full">
            <FadeIn duration={0.5}>
                <h1 className="text-center text-3xl font-bold mt-20">{t('title')}</h1>
            </FadeIn>
            <FadeIn key={step} duration={0.5}>
                <div className="mx-2">
                    <Card className="max-w-xl mx-auto mt-10">
                        <MagicCard gradientColor="#D9D9D955">
                            <CardHeader />
                            <CardContent>
                                {step === 1 && (
                                    <Step1
                                        setStep={setStep}
                                        setEmail={setEmail}
                                        setPassword={setPassword}
                                    />
                                )}
                                {step === 2 && (
                                    <Step2
                                        setStep={setStep}
                                        setEmail={setEmail}
                                        setPassword={setPassword}
                                        email={email}
                                        password={password}
                                        handleLogin={handleLogin}
                                        errorLogin={errorLogin}
                                        disabled={disabled}
                                        loading={loading}
                                    />
                                )}
                            </CardContent>
                            <CardFooter className="grid">
                                <LoginFooter />
                            </CardFooter>
                        </MagicCard>
                    </Card>
                </div>
            </FadeIn>
        </div>
    );
}
