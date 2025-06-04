import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Divider from "@mui/material/Divider";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";

type Step1Props = {
  setStep: (step: number) => void;
  setName: (name: string) => void;
  setRepeatEmail: (email: string) => void;
  setRepeatPassword: (password: string) => void;
};

export default function Step1({
  setStep,
  setName,
  setRepeatEmail,
  setRepeatPassword,
}: Step1Props) {

  const t = useTranslations("signup");
  return (
    <div className="grid gap-4">
      <Button
        variant="outline"
        onClick={() => signIn("google")}
        className="flex items-center justify-center gap-2 text-lg"
      >
        <Image src="/google-icon.svg" alt="Google Logo" width="24" height="24" />
        {t('options.google')}
      </Button>
      <Button
        variant="outline"
        onClick={() => signIn("github")}
        className="flex items-center justify-center gap-2 text-lg my-5"
      >
        <Image src="/github-mark.svg" alt="GitHub Logo" width="24" height="24" />
        {t('options.github')}
      </Button>
      <Divider>{t('options.separator')}</Divider>
      <Button
        className="flex items-center justify-center gap-2 text-lg mt-5"
        onClick={() => {
          // Limpia los campos y pasa al paso 2 (formulario de registro con email)
          setName("");
          setRepeatEmail("");
          setRepeatPassword("");
          setStep(2);
        }}
      >
        <Image src="/email.png" alt="Email logo" width="24" height="24" />
        {t('options.email')}
      </Button>
    </div>
  );
}
