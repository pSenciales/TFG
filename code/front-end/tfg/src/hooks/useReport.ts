"use client";

import { useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";


export function useReport() {

  // Controlar el envio del formulario
  const [loading, setLoading] = useState(false);

  // Campos del formulario
  const [context, setContext] = useState("");
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");
  const [source, setSource] = useState("");
  const [view, setView] = useState("text");

  // Recaptcha
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");


  const handleChangeRecaptcha = (token: string | null) => {
    setIsVerified(true);
    setCaptchaToken(token || "");
  };

  const handleExpired = () => {
    setIsVerified(false);
  };

  return {
    loading,
    setLoading,
    context,
    setContext,
    content,
    setContent,
    url,
    setUrl,
    view,
    setView,
    source,
    setSource,
    recaptchaRef,
    handleChangeRecaptcha,
    handleExpired,
    isVerified,
    setIsVerified,
    captchaToken,
  };
}
