import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type RegisterFooterProps = {
  step: number;
  disabled: boolean;
  handleSendEmail: (captchaToken: string, captchaJWT: string) => void;
  captchaToken: string;
  captchaJWT: string;
  counter: number;
};

export default function RegisterFooter({
  step,
  disabled,
  handleSendEmail,
  captchaToken,
  captchaJWT,
  counter,
}: RegisterFooterProps) {
  return (
    <>
      {step === 2 && (
        <span className="text-silver">
          By continuing, you agree to the{" "}
          <Link href="https://ff4403af6cc643b7dee63902c1bc09ae97315884bcd9cae574a0c38-apidata.googleusercontent.com/download/storage/v1/b/fairplay360-reports/o/account-agreetment.pdf?jk=AVJhS7s_nZunS8eG_rcRdCguVImuyxwZmU1O40CaL3UEi4NvcjQKZW2xJkcTY3PXiIAiZHndtyGNK_LpGWaTFTuTd4dVLNFsnMU0wQhi6g17krIT9ajCXj6fteHFj-ndSFPvP974GeNPRa86ZNVk1sWSycWrRPgBYvcSQQtRY_T6oM7oSlqs6Zm9r9BvVg38C70HRjuISR2ycJeKrP09X5M-PNssCcib2C9KuGMY5_PWKqMrAdpdSmoDQwNc1hG_7FpP8-AUJ2wcbHeQXjH0o9NMnvrXtf2wtXwWsYu2kdYrW4SkHmQxLwMD0eI_rENJ3scnw76SB0uB7JuQgx0xtCBM2UsHjXSoVOa0BPz6Td5nHC_4UenqIRquBsVO4uruWHSUeL4ywBoLe0YfHrRfMAo7foif8EmxY6iyUmhq-DL0LAnwBiCr40zoqIq8mzMn3tvh35hv_kqDQLq2iSzH3Yjcz7tXBY70RwHFPN19g-q3sckp7NZ5c506P1qSSV3jNGuHeWap5yH5MQowlHBPM_7Q8Z8EbpRRLkoMWfMU_fJbDLJOO3Pu2oVtTCxynhMc7HDKnKn92cKTQ-R6TwBr9qiqXtP5-4T-keykitRBT8XmyZ2e4ApdVvN6vRIRAhbLGgOJXFatPFniIZRZMSd5fbAphhXgcSCI_23r9jTYwM8iwp4vQGGrwBw71-Qq6S_mNXdiIrxTtsbqRNGxpNGpzXpwjLXAbZQWLQsGXUM_mVlRCyY3321FXfJVSuqHry1yNxCaLZHVOJvy61Fo8VaJUxRXvBLQs32OUg-9YCXDxGwtMdYm17X-5bItFzTWMUeWEqJNQmb_5_VCa2aV-oMYoRp2F3yinJlkpiUfyTSs0olD8JftT_If7RwYP68eT7cgjh66BrSMzRIv9rzcTlNRdFH9FuoxBH2u4ga2se35hKUt0ELcA7O4Cbh9x9YG8DI02rh_gsFeCxCcmad0s1RSDFLu2bAurFIRJoaMGlvxv3aGFaCNR_wVANTqAPlYH2O0LzEYWA5-VIcvL1NuTVW_c_gNe9q7E99OktAcaddUL5eJwFflBVG2K9sRFc-Q0qf1amE8STTsUb4qm73wnjX2DvePBUJhw2a5iqaBbPLKvFPJ7YwGDzIujxhvBrNs45ORdStHK17DUOVOjsr6TYDn3qJjqptR365p8gfrotjzZp15N4B87rFdwGJVulQdgry7zzoHPH7iChDaWvq86eKUwxeNjB0Sj16CRTw&isca=1" className="text-blue underline">
            Account agreetment
          </Link>
        </span>
      )}
      {step < 3 && (
        <span className="text-silver">
          Already have an account,{" "}
          <Link href="/login" className="text-blue underline">
            Log In here
          </Link>
        </span>
      )}
      {step === 3 && (
        <span className="text-silver">
          The code can take a few minutes to send.{" "}
          <Button
            variant="ghost"
            className="w-min ml-0 text-blue"
            disabled={disabled}
            onClick={() => handleSendEmail(captchaToken, captchaJWT)}
          >
            Resend code? {disabled && `(${counter}s)`}
          </Button>
        </span>
      )}
    </>
  );
}