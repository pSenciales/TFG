import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

type Step2Props = {
  setStep: (step: number) => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  email: string;
  password: string;
  errorLogin: string;
  loading: boolean;
  disabled: boolean;
  handleLogin: (email: string, password: string) => void;
};

export default function Step2({
  setStep,
  setEmail,
  setPassword,
  email,
  password,
  handleLogin,
  errorLogin,
  loading,
  disabled
}: Step2Props) {
  return (
    <div>
      <Button
        variant="ghost"
        className="pl-0 mb-5 text-md"
        onClick={() => setStep(1)}
      >
        <Image src="/left-arrow.svg" alt="Back" width="20" height="20" /> All log in options
      </Button>
      <div className="grid gap-5">
        <div>
          <Label>Email</Label>
          <Input
            type="email"
            placeholder="example@mail.com"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <Label>Password</Label>
          <Input
            type="password"
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <span className="text-red-500">{errorLogin}</span>
        <Button
          className="mt-5"
          disabled={email === "" || password === "" || disabled}
          onClick={() => handleLogin(email, password)}
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
          'Log in with email'
        )}
        </Button>
      </div>
    </div>
  );
}
