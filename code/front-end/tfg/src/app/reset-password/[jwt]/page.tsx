"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { MagicCard } from "@/components/magicui/magic-card";
import { useSignup } from "@/hooks/useSignup";
import FadeIn from "@/components/fadeIn";
import swal from "sweetalert2";

export default function ResetPasswordPage() {
  const params = useParams();
  const jwt = params.jwt;
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {
    password,
    repeatPassword,
    handlePasswordChange,
    setRepeatPassword,
    disabledPw,
    passwordCheck,
    
  }= useSignup();


  async function checkJWT() {
    if (!session) {
      try {
        const { data } = await axios.get(`/api/check-jwt?jwt=${jwt}`)
        return data.status === "ok"
      } catch (error) {
        console.log(error)
        return false
      }
    }
    return false
  }

  useEffect(() => {
    const checkToken = async () => {
      const checked = await checkJWT();
      console.log("checked", checked)
      if (status === "authenticated" || !checked) {
        router.push("/");
      }
    };
    checkToken();
  }, [status, router]);


  async function handleResetPassword(){
    try {
      setLoading(true)
      const { data } = await axios.put(`/api/reset-password?jwt=${jwt}`, { password })
      if (data.status === 200) {
        await swal.fire({
          title: 'Success!',
          text: 'Password reset successfully',
          icon: 'success'
        });
        router.push("/login")
      } else if(data.error === "Token expired"){
        await swal.fire({
          title: 'Error!',
          text: 'Token expired',
          icon: 'error'
        });
      } else {
        await swal.fire({
          title: 'Error!',
          text: 'Error resetting password',
          icon: 'error'
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error)
        if(error.status === 401){
          await swal.fire({
            title: 'Error!',
            text: 'Token expired',
            icon: 'error'
          });
      }}
    }finally {
      setLoading(false)
    }
  }


  return (
    <div>
      <FadeIn>
      <h1 className="text-center text-3xl font-bold mt-20">Reset your password</h1>
      <Card className="max-w-xl mx-auto mt-10">
        <MagicCard gradientColor="#D9D9D955">
          <CardHeader />
          <CardContent>
            <div className="grid gap-4">
              <div>
                <form className="grid gap-5">
                  <div>
                    <Label>New password</Label>
                    <Input
                      type="password"
                      placeholder="password"
                      onChange={(e) => handlePasswordChange(e)}
                    />
                    <span className="text-red-500 text-sm">{passwordCheck}</span>
                  </div>
                  <div>
                    <Label>Repeat new password</Label>
                    <Input
                      type="password"
                      placeholder="password"
                      onChange={(e) => setRepeatPassword(e.target.value)}
                    />
                  </div>
                  <Button
                    className="mt-5"
                    disabled={disabledPw || password !== repeatPassword || loading}
                    onClick={handleResetPassword}
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
                      'Save new password'
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </CardContent>
          <CardFooter className="grid">
          </CardFooter>
        </MagicCard>
      </Card>
      </FadeIn>
    </div>
  );
}


