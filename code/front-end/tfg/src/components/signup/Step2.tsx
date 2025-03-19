import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import ReCAPTCHA from "react-google-recaptcha";

type Step2Props = {
  setStep: (step: number) => void;
  handleEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setRepeatEmail: (value: string) => void;
  handlePasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  passwordCheck: string;
  emailCheck: string;
  setRepeatPassword: (value: string) => void;
  recaptchaRef: React.RefObject<ReCAPTCHA>;
  handleChangeRecaptcha: (token: string | null) => void;
  handleExpired: () => void;
  email: string;
  repeatEmail: string;
  password: string;
  repeatPassword: string;
  loading: boolean;
  disabledEmail: boolean;
  disabledPw: boolean;
  isVerified: boolean;
  captchaToken: string;
  handleContinue: (captchaToken: string) => void;
};

export default function Step2({
  setStep,
  handleEmailChange,
  setRepeatEmail,
  handlePasswordChange,
  passwordCheck,
  emailCheck,
  setRepeatPassword,
  repeatPassword,
  recaptchaRef,
  handleChangeRecaptcha,
  handleExpired,
  email,
  repeatEmail,
  password,
  loading,
  disabledEmail,
  disabledPw,
  isVerified,
  captchaToken,
  handleContinue,
}: Step2Props) {
  return (
    <div>
      <Button
        variant="ghost"
        className="pl-0 mb-5 text-md"
        onClick={() => setStep(1)}
      >
        <Image src="/left-arrow.svg" alt="Back" width="20" height="20" /> All sign up options
      </Button>
      <div className="grid gap-5">
        <div>
          <Label>Email</Label>
          <Input
            type="email"
            placeholder="example@mail.com"
            onChange={handleEmailChange}
          />
           <span className="text-red-500 text-xs">{emailCheck}</span>
        </div>
        <div>
          <Label>Repeat email</Label>
          <Input
            type="email"
            placeholder="example@mail.com"
            onChange={(e) => setRepeatEmail(e.target.value)}
          />
        </div>
        <div>
          <Label>Password</Label>
          <Input
            type="password"
            placeholder="password"
            onChange={handlePasswordChange}
          />
          <span className="text-red-500 text-xs">{passwordCheck}</span>
        </div>
        <div>
          <Label>Repeat password</Label>
          <Input
            type="password"
            placeholder="password"
            onChange={(e) => setRepeatPassword(e.target.value)}
          />
        </div>
        <ReCAPTCHA
          className="mx-auto"
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA || ""}
          ref={recaptchaRef}
          onChange={handleChangeRecaptcha}
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
  );
}
