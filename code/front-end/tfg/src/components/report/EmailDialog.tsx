// EmailDialog.tsx
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FadeIn from "../fadeIn";
import FullScreenLoader from "./FullScreenLoader";
import ReCAPTCHA from "react-google-recaptcha";

import { useTranslations } from "next-intl";

import { Link } from '@/i18n/navigation';

interface EmailDialogProps {
  type: "text" | "image" | "post";
  loading: boolean;
  isVerified: boolean;
  email: string;
  emailCheck: string;
  handleEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAnalyze: (e: React.FormEvent) => Promise<void>;
  recaptchaRef: React.RefObject<ReCAPTCHA>;
  handleChangeRecaptcha: (token: string | null) => void;
  handleExpired: () => void;
  params: string[];
  checkURL: string;
  files?: File[];
}
export default function EmailDialog({
  type,
  loading,
  isVerified,
  email,
  emailCheck,
  handleEmailChange,
  handleAnalyze,
  recaptchaRef,
  handleChangeRecaptcha,
  handleExpired,
  params,
  checkURL,
  files,
}: EmailDialogProps) {
  const t = useTranslations("reports");
  let requiredParams = params.some((element) => element === "");
  if (files) {
    requiredParams = requiredParams || files.length !== 1;
  }

  const getTextArray = (type: string): string[] => {
    switch (type) {
      case "text":
        return ["Adding context...", "Analyzing text...", "Generating report..."];
      case "image":
        return ["Extracting text...", "Adding context...", "Analyzing text...", "Generating report..."];
      case "post":
        return ["Scraping tweet...", "Adding context...", "Analyzing text...", "Generating report..."];
      default:
        return [];
    }
  };

  return (
    <div>
      {loading && (
        <FullScreenLoader
          words={getTextArray(type)}
        />
      )}

      <ReCAPTCHA
        className="mx-auto mt-10"
        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA || ""}
        ref={recaptchaRef}
        onChange={handleChangeRecaptcha}
        onExpired={handleExpired}
      />

      <Dialog>
        <DialogTrigger asChild>
          <Button disabled={requiredParams || loading || !isVerified || checkURL !== ""} className="mt-10">
            Analyze
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t('dialog.title')}</DialogTitle>
            <DialogDescription>
              {t('dialog.description')}
              <Link href={"/login"}>{t('dialog.description2')}</Link>
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input id="email" className="col-span-3" onChange={handleEmailChange} />
            </div>
            <FadeIn>
              <p className="text-red-500 text-sm">{emailCheck}</p>
            </FadeIn>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={emailCheck !== "" || email === "" || loading}
              onClick={handleAnalyze}
            >
              {t('dialog.continue')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
