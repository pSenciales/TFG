"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import ReCAPTCHA from "react-google-recaptcha";

export function useSignup() {
  const FLASK_URL = process.env.NEXT_PUBLIC_FLASK_API_URL;

  // Estados del formulario
  const [email, setEmail] = useState("");
  const [repeatEmail, setRepeatEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [isOldEnough, setIsOldEnough] = useState(false);

  // Estados para OTP y pasos
  const [otp, setOtp] = useState("");
  const [otpToken, setOtpToken] = useState("");
  const [step, setStep] = useState(1);

  // Estados para contador y validaciones
  const [counter, setCounter] = useState(60);
  const [disabled, setDisabled] = useState(true);
  const [disabledEmail, setDisabledEmail] = useState(true);
  const [disabledPw, setDisabledPw] = useState(true);
  const [passwordCheck, setPasswordCheck] = useState("");
  const [emailCheck, setEmailCheck] = useState("");


  // Estados para loading y error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Recaptcha
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaJWT, setCaptchaJWT] = useState("");

  // Contador
  useEffect(() => {
    if (counter === 0) {
      setDisabled(false);
      return;
    }
    const timer = setInterval(() => {
      setCounter((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [counter]);

  // Funciones para manejo de cambios

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(newEmail)) {
      setDisabledEmail(false);
      setEmailCheck("")
    } else {
      setEmailCheck("This is not a valid email");
      setDisabledEmail(true);
    }

  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;
    if (passwordRegex.test(newPassword)) {
      setDisabledPw(false);
      setPasswordCheck("");
    } else {
      setDisabledPw(true);
      setPasswordCheck(
        "At least 8 characters.\nAt least one uppercase letter.\nAt least one lowercase letter.\nAt least one special character (e.g., !@#$%^&*)."
      );
    }
  };

  const handleBirthdayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBirthday(e.target.value);
    const birthDate = new Date(e.target.value);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    setIsOldEnough(age >= 16);
  };

  // Funciones para peticiones

  const handleSendEmail = async (
    captchaTokenGenerated: string | null,
    captchaJWT: string | null
  ) => {
    try {
      const { data } = await axios.post("/api/send-email/otp/send", {
        to: email,
        captchaRecibed: captchaTokenGenerated,
        captchaJWT: captchaJWT,
      });
      setOtpToken(data.token);
      if (data.captchaJWT) setCaptchaJWT(data.captchaJWT);
      setCounter(60);
      setDisabled(true);
    } catch (error: unknown) {
      console.error(error);
    }
  };


  const resetVerification = () => {
    setIsVerified(false);
    setCaptchaToken("");
    recaptchaRef.current?.reset();
  };

  const handleContinue = async (captchaTokenGenerated: string | null) => {
    setDisabled(true);
    setLoading(true);
    try {
      const response = await axios.get(`${FLASK_URL}/users/email/${email}`);
      console.log(response.data);


      const { success } = response.data;

      switch (success) {
        case "User found": {
          toast.warning("Email already in use", {
            description: `${email} is already registered, try to log in here`,
            action: {
              label: "Log In",
              onClick: () => (window.location.href = "/login"),
            },
          });
          resetVerification();
          break;
        }

        case "User banned": {
          toast.error("Email not allowed", {
            description: `${email} is banned`,
          });
          resetVerification();
          break;
        }

        case "User not found": {
          await handleSendEmail(captchaTokenGenerated, null);
          setStep(3);
          break;
        }

        default:
          console.warn("Unhandled response:", success);
      }
    } catch (error: unknown) {
      console.error("Unexpected error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    try {
      setLoading(true);
      const { status } = await axios.post("/api/send-email/otp/verify", {
        token: otpToken,
        mail: email,
        otp: otp,
      });
      if (status === 200) {
        setError("");
        setStep(4);
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response && err.response.status === 400) {
        console.log(err.response);
        setError("The code entered is incorrect or expired.");
      } else {
        setError("An error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = async () => {
    setLoading(true);
    try {
      await axios.post(`${FLASK_URL}/users`, {
        name,
        password,
        email,
        provider: "credentials",
        captchaJWT,
        captchaToken,
      }, {
        headers: {
          "Content-Type": "application/json",
        }
      });

      signIn("credentials", {
        email: email,
        password: password,
      });
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        console.error("Error response:", error.response.data);
        toast.error("An error occurred. Please try again later.");
      } else {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChangeRecaptcha = (token: string | null) => {
    setIsVerified(true);
    setCaptchaToken(token || "");
  };

  const handleExpired = () => {
    setIsVerified(false);
  };

  return {
    email,
    repeatEmail,
    password,
    repeatPassword,
    name,
    birthday,
    isOldEnough,
    otp,
    otpToken,
    step,
    counter,
    disabled,
    disabledEmail,
    disabledPw,
    passwordCheck,
    emailCheck,
    loading,
    error,
    recaptchaRef,
    isVerified,
    captchaToken,
    captchaJWT,
    handleSendEmail,
    handleContinue,
    handleVerify,
    handleBirthdayChange,
    handleEmailChange,
    handlePasswordChange,
    handleCreateAccount,
    handleChangeRecaptcha,
    handleExpired,
    setRepeatEmail,
    setRepeatPassword,
    setName,
    setStep,
    setOtp
  };
}
