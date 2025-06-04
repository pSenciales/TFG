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
    emailCheck
  } = useSignup();


  async function sendMail(){
    try{
      const res = await axios.post("/api/send-email/reset-password", { email })
      if(res.status === 200){
        swal.fire({
          title: t('footer.forgotpassword.alert.title'),
          text: t('footer.forgotpassword.alert.text'),
          icon: "success",
          confirmButtonText: "OK",
        });
      }
    
      }catch (error) {
        console.error("An error occurred during login:", error);
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
        <DialogTrigger  asChild>
          <Link href="/login/#" className="text-blue underline">
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
              disabled={emailCheck !== "" || email === ""}
              onClick={sendMail}
            >
              {t('footer.forgotpassword.dialog.submit')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}