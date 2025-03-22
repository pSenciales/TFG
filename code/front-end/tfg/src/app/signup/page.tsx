"use client";
import { useSignup } from "@/hooks/useSignup"
import Step1 from "@/components/signup/Step1"
import Step2 from "@/components/signup/Step2"
import Step3 from "@/components/signup/Step3"
import Step4 from "@/components/signup/Step4"
import RegisterFooter from "@/components/signup/RegisterFooter"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { MagicCard } from "@/components/magicui/magic-card";
import FadeIn from "@/components/fadeIn";


export default function Register() {
    const {
        email,
        repeatEmail,
        password,
        repeatPassword,
        name,
        birthday,
        isOldEnough,
        step,
        counter,
        disabled,
        disabledEmail,
        disabledPw,
        passwordCheck,
        emailCheck,
        loading,
        error,
        recaptchaRef,
        isVerified,
        captchaToken,
        captchaJWT,
        handleSendEmail,
        handleContinue,
        handleVerify,
        handleBirthdayChange,
        handleEmailChange,
        handlePasswordChange,
        handleCreateAccount,
        handleChangeRecaptcha,
        handleExpired,
        setRepeatEmail,
        setRepeatPassword,
        setName,
        setStep,
        setOtp
    } = useSignup();

    return (
        <div className="h-full">
            <FadeIn duration={0.5}>
                <h1 className="text-center text-3xl font-bold mt-20">Sign Up to Fairplay360</h1>
            </FadeIn>
            <FadeIn key={step} duration={0.5}>
                <Card className="max-w-xl mx-auto mt-10">
                    <MagicCard gradientColor="#D9D9D955">
                        <CardHeader />
                        <CardContent>
                            {step === 1 && (
                                <Step1
                                    setStep={setStep}
                                    setName={setName}
                                    setRepeatEmail={setRepeatEmail}
                                    setRepeatPassword={setRepeatPassword}
                                />
                            )}
                            {step === 2 && (
                                <Step2
                                    setStep={setStep}
                                    handleEmailChange={handleEmailChange}
                                    setRepeatEmail={setRepeatEmail}
                                    handlePasswordChange={handlePasswordChange}
                                    passwordCheck={passwordCheck}
                                    emailCheck={emailCheck}
                                    setRepeatPassword={setRepeatPassword}
                                    recaptchaRef={recaptchaRef}
                                    handleChangeRecaptcha={handleChangeRecaptcha}
                                    handleExpired={handleExpired}
                                    email={email}
                                    repeatEmail={repeatEmail}
                                    password={password}
                                    repeatPassword={repeatPassword}
                                    loading={loading}
                                    disabledEmail={disabledEmail}
                                    disabledPw={disabledPw}
                                    isVerified={isVerified}
                                    captchaToken={captchaToken}
                                    handleContinue={handleContinue}
                                />
                            )}
                            {step === 3 && (
                                <Step3 error={error} setOtp={setOtp} handleVerify={handleVerify} />
                            )}
                            {step === 4 && (
                                <Step4
                                    setName={setName}
                                    handleBirthdayChange={handleBirthdayChange}
                                    name={name}
                                    birthday={birthday}
                                    isOldEnough={isOldEnough}
                                    handleCreateAccount={handleCreateAccount}
                                />
                            )}
                        </CardContent>
                        <CardFooter className="grid">
                            <RegisterFooter
                                step={step}
                                disabled={disabled}
                                handleSendEmail={handleSendEmail}
                                captchaToken={captchaToken}
                                captchaJWT={captchaJWT}
                                counter={counter}
                            />
                        </CardFooter>
                    </MagicCard>
                </Card>
            </FadeIn>

        </div>
    );
}
