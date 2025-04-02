"use client";

import { useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";
import { useSession } from "next-auth/react";


export function useReport() {
  const { data: session } = useSession();

  // Controlar el envio del formulario
  const [loading, setLoading] = useState(false);

  // Campos del formulario
  const [context, setContext] = useState("");
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");
  const [source, setSource] = useState("");
  const [view, setView] = useState("text");
  const [files, setFiles] = useState<File[]>([])


  // Recaptcha
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");

  // Email no registrado
  const [email, setEmail] = useState("");

  // Check
  const [emailCheck, setEmailCheck] = useState("");
  const [urlCheck, setUrlCheck] = useState("")
  const [sourceCheck, setSourceCheck] = useState("")

  const handleChangeRecaptcha = (token: string | null) => {
    setIsVerified(true);
    setCaptchaToken(token || "");
  };

  const handleExpired = () => {
    setIsVerified(false);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(newEmail)) {
      setEmailCheck("")
    } else {
      setEmailCheck("This is not a valid email");
    }

  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setUrl(url);
    const tweetRegex = /^https:\/\/x\.com\/[a-zA-Z0-9_]{4,15}\/status\/\d+$/;

    if (tweetRegex.test(url)) {
      setUrlCheck("");
    } else {
      setUrlCheck("This is not a valid tweet URL");
    }
  };



  const handleSourceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const source = e.target.value;
    setSource(source);
    const sourceRegex = /^https?:\/\/[^\s]+$/;

    if (sourceRegex.test(source)) {
      setSourceCheck("");
    } else {
      setSourceCheck("This is not a valid URL");
    }
  };


  const handleAnalyzeImage = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!files) return;

    const formData = new FormData();
    formData.append("captchaToken", captchaToken)
    formData.append("file", files[0]);
    formData.append("context", context);
    formData.append("source", source);
    formData.append("type", "image");
    if (session) {
      formData.append("email", session.user.email || "");
    } else {
      formData.append("email", email);
    }

    try {

      await axios.post("/api/analyze", formData);
      alert("EMAIL ENVIADO!");
    } catch (error) {
      console.error("Error al subir la imagen:", error);
    } finally {
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
      setLoading(false);
    }
  };


  const handleAnalyzePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("captchaToken", captchaToken)
    formData.append("url", url);
    formData.append("context", context);
    formData.append("type", "post");
    if (session) {
      formData.append("email", session.user.email || "");
    } else {
      formData.append("email", email);
    }

    try {

      await axios.post("/api/analyze", formData);
      alert("EMAIL ENVIADO!");
    } catch (error) {
      console.error("Error al subir la imagen:", error);
    } finally {
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
      setLoading(false);
    }
  };


  const handleAnalyzeText = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("captchaToken", captchaToken)
    formData.append("source", source);
    formData.append("context", context);
    formData.append("content", content);
    formData.append("type", "text");
    if (session) {
      console.log(`SESSION:${session.user.email}`)
      formData.append("email", session.user.email || "");
    } else {
      formData.append("email", email);
    }

    try {

      await axios.post("/api/analyze", formData);
      alert("EMAIL ENVIADO!");
    } catch (error) {
      console.error("Error al analizar el texto:", error);
    } finally {
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
      setLoading(false);
    }
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
    email,
    setEmail,
    emailCheck,
    handleEmailChange,
    handleAnalyzeText,
    handleAnalyzeImage,
    handleAnalyzePost,
    files,
    setFiles,
    urlCheck,
    setUrlCheck,
    sourceCheck,
    setSourceCheck,
    handleUrlChange,
    handleSourceChange,
    session
  };
}
