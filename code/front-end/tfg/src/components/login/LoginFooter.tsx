import React from "react";
import Link from "next/link";
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

import FadeIn from "../fadeIn";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { useSignup } from "@/hooks/useSignup";


export default function RegisterFooter() {

  const { email,
    handleEmailChange,
    emailCheck
  } = useSignup();


  async function sendMail(){
    try{
      const res = await axios.post("/api/send-email/reset-password", { email })
      if(res.status === 200){
        swal.fire({
          title: "Email sent",
          text: "Check your email to reset your password",
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
        Don&apos;t have an account,&nbsp;
        <Link href="/signup" className="text-blue underline">
          Sign up here!
        </Link>
      </span>
      <Dialog>
        <DialogTrigger  asChild>
          <Link href="/login/#" className="text-blue underline">
            Forgot your password?
          </Link>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add an email</DialogTitle>
            <DialogDescription>
              Write your email to receive a link to reset your password.
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
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}