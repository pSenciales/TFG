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

import { useTranslations } from 'next-intl';

export default function ResetPasswordPage() {
  const t = useTranslations('resetpassword');

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

  } = useSignup();


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


  async function handleResetPassword() {
    try {
      setLoading(true)
      const { data } = await axios.put(`/api/reset-password?jwt=${jwt}`, { password })
      if (data.status === 200) {
        await swal.fire({
          title: t('alerts.success.title'),
          text: t('alerts.success.text'),
          icon: 'success'
        });
        router.push("/login")
      } else if (data.error === "Token expired") {
        await swal.fire({
          title: t('alerts.token.title'),
          text: t('alerts.token.text'),
          icon: 'error'
        });
      } else {
        await swal.fire({
          title: t('alerts.error.title'),
          text: t('alerts.error.text'),
          icon: 'error'
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error)
        if (error.status === 401) {
          await swal.fire({
            title: 'Error!',
            text: 'Token expired',
            icon: 'error'
          });
        }
      }
    } finally {
      setLoading(false)
    }
  }


  return (
    <div>
      <FadeIn>
        <h1 className="text-center text-3xl font-bold mt-20">{t('title')}</h1>
        <div className="mx-2">
          <Card className="max-w-xl mx-auto mt-10 ">
            <MagicCard gradientColor="#D9D9D955">
              <CardHeader />
              <CardContent>
                <div className="grid gap-4">
                  <div>
                    <form className="grid gap-5">
                      <div>
                        <Label>{t('newpassword')}</Label>
                        <Input
                          type="password"
                          placeholder={t('password')}
                          onChange={(e) => handlePasswordChange(e)}
                        />
                        <span className="text-red-500 text-sm">{passwordCheck}</span>
                      </div>
                      <div>
                        <Label>{t('repeatnewpassword')}</Label>
                        <Input
                          type="password"
                          placeholder={t('password')}
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
                          t('button')
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
        </div>
      </FadeIn>
    </div>
  );
}


