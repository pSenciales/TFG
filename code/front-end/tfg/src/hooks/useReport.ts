"use client";

import { useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import axios, { AxiosError } from "axios";
import { signOut, useSession } from "next-auth/react";
import Swal from 'sweetalert2'

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
    const sourceRegex = /^https?:\/\/\S+\.\S+$/;

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
      const res = await axios.post("/api/analyze", formData);
      if (res.status === 200) {
        Swal.fire({
          title: 'Email sent!',
          text: 'The analisis will be sent to your email',
          icon: 'success'
        })
      }
    } catch (error) {
      showAlert(error);
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

      const res = await axios.post("/api/analyze", formData);
      if (res.status === 200) {
        Swal.fire({
          title: 'Email sent!',
          text: 'The analisis will be sent to your email',
          icon: 'success'
        })
      }
    } catch (error) {
      showAlert(error);
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
      formData.append("email", session.user.email || "");
    } else {
      formData.append("email", email);
    }

    try {

      const res = await axios.post("/api/analyze", formData);
      if (res.status === 200) {
        Swal.fire({
          title: 'Email sent!',
          text: 'The analisis will be sent to your email',
          icon: 'success'
        })

      }
    } catch (error) {

      showAlert(error);

    } finally {
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
      setLoading(false);
    }
  };

  const showAlert = (error: unknown) => {
    if (error instanceof AxiosError && error.status === 401 && error.response?.data.error === "Session expired or invalid token") {
      Swal.fire({
        title: 'The session has expired!',
        text: 'please log in again',
        icon: 'warning'
      });
      signOut();
      window.location.href = "/login";
    } else if (error instanceof AxiosError && error.status === 403 && error.response?.data.error === "Email is banned") {
      Swal.fire({
        title: 'Email is banned!',
        text: 'Please contact support for more information.',
        icon: 'warning'
      });
    } else {
      console.log(error);
      Swal.fire({
        title: 'Error!',
        text: 'An error occurred while sending the analysis. Please try again later.',
        icon: 'error'
      });
    }
  }




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
