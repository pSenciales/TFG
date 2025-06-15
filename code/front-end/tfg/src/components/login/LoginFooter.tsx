import React from "react";
import { Link } from '@/i18n/navigation';
import axios from "axios";
import swal from "sweetalert2";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useTranslations } from 'next-intl';

import FadeIn from "../fadeIn";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { useSignup } from "@/hooks/useSignup";


export default function RegisterFooter() {

  const t = useTranslations('login');
  const { email,
    handleEmailChange,
    emailCheck,
    loading,
    setLoading
  } = useSignup();


  async function sendMail() {
    try {
      setLoading(true);
      const res = await axios.post("/api/send-email/reset-password", { email })
      if (res.status === 200) {
        swal.fire({
          title: t('footer.forgotpassword.alert.title'),
          text: t('footer.forgotpassword.alert.text'),
          icon: "success",
          confirmButtonText: "OK",
        });
      }

    } catch (error) {
      console.error("An error occurred during login:", error);
    }finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col">
      <span className="text-silver">
        {t('footer.noaccount')},&nbsp;
        <Link href="/signup" className="text-blue underline">
          {t('footer.signuphere')}
        </Link>
      </span>
      <Dialog>
        <DialogTrigger asChild>
          <Link href="/login" className="text-blue underline">
            {t('footer.forgotpassword.title')}
          </Link>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t('footer.forgotpassword.dialog.title')}</DialogTitle>
            <DialogDescription>
              {t('footer.forgotpassword.dialog.description')}
            </DialogDescription>
          </DialogHeader>
          <form>
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
                onClick={sendMail}
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
              t('footer.forgotpassword.dialog.submit')
            )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}