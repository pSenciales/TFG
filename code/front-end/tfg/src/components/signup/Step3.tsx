import React from "react";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";

import { useTranslations } from "next-intl";

type Step3Props = {
    error: string;
    setOtp: (otp: string) => void;
    handleVerify: () => void;
    loading: boolean;
};

export default function Step3({ error, setOtp, handleVerify, loading }: Step3Props) {
    const t = useTranslations("signup.step3");
    return (
        <form className="grid justify-center">
            <h1 className="text-md">{t('header')}</h1>
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
            <Button disabled={loading} onClick={handleVerify} >{t('verify')}</Button>
        </form>
    );
}
