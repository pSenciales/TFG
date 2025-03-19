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
  handleLogin: (email: string, password: string) => void;
};

export default function Step2({
  setStep,
  setEmail,
  setPassword,
  email,
  password,
  handleLogin,
  errorLogin
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
          disabled={email === "" || password === ""}
          onClick={() => handleLogin(email, password)}
        >
          Log in with email
        </Button>
      </div>
    </div>
  );
}
