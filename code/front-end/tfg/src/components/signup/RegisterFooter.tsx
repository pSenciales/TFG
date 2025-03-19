import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type RegisterFooterProps = {
  step: number;
  disabled: boolean;
  handleSendEmail: (captchaToken: string, captchaJWT: string) => void;
  captchaToken: string;
  captchaJWT: string;
  counter: number;
};

export default function RegisterFooter({
  step,
  disabled,
  handleSendEmail,
  captchaToken,
  captchaJWT,
  counter,
}: RegisterFooterProps) {
  return (
    <>
      {step === 2 && (
        <span className="text-silver">
          By continuing, you agree to the{" "}
          <Link href="/account-agreetment" className="text-blue underline">
            Account agreetment
          </Link>
        </span>
      )}
      {step < 3 && (
        <span className="text-silver">
          Already have an account,{" "}
          <Link href="/login" className="text-blue underline">
            Log In here
          </Link>
        </span>
      )}
      {step === 3 && (
        <span className="text-silver">
          The code can take a few minutes to send.{" "}
          <Button
            variant="ghost"
            className="w-min ml-0 text-blue"
            disabled={disabled}
            onClick={() => handleSendEmail(captchaToken, captchaJWT)}
          >
            Resend code? {disabled && `(${counter}s)`}
          </Button>
        </span>
      )}
    </>
  );
}