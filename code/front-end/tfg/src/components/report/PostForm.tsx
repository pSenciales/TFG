

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MagicCard } from "@/components/magicui/magic-card";

import { useReport } from "@/hooks/useReport";
import { useSession } from "next-auth/react";

import FullScreenLoader from "./FullScreenLoader";
import ReCAPTCHA from "react-google-recaptcha";

import axios from "axios";

export default function PostForm() {
  const { data: session } = useSession();

  const {
    setUrl,
    url,
    setContext,
    context,
    setLoading,
    loading,
    recaptchaRef,
    handleChangeRecaptcha,
    handleExpired,
    isVerified,
    captchaToken
  } = useReport();

  const handleAnalizePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("captchaToken", captchaToken)
    formData.append("url", url);
    formData.append("context", context);
    formData.append("type", "post");

    try {
      const response = await axios.post("/api/analize", formData);
      const data = response.data;
      alert("The text is: " + data.content + "\nReasoning: " + data.reasoning);
    } catch (error) {
      console.error("Error al subir la imagen:", error);
    } finally {
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
      setLoading(false);
    }
  };


  return (
    <Card className="max-w-7xl">
      {loading &&
        <FullScreenLoader
          words={["Scraping tweet...", "Adding context...", "Analizing text...", "Generating report..."]}
        />}

      <MagicCard gradientColor="#D9D9D955">
        <CardHeader />
        <CardContent>
          <Label >URL<span className="text-red-500"> &#42;</span></Label>
          <Textarea placeholder="Write your report here" onChange={(e) => setUrl(e.target.value)} required />
          <p className="text-sm text-muted-foreground">
            This text will be analyzed and a added to the report, if the post has images, the first one will be used as context
          </p>
          <Label className="mt-10">Context</Label>
          <Textarea
            placeholder="Write the context here"
            className="peer-disabled:bg-gray-100"
            onChange={(e) => setContext(e.target.value)}
          />
          <p className="text-sm text-muted-foreground">
            This text will be added as context to the report, making the report more accurated
          </p>
          {!session ? (
            <div>

              <ReCAPTCHA
                className="mx-auto mt-10"
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA || ""}
                ref={recaptchaRef}
                onChange={handleChangeRecaptcha}
                onExpired={handleExpired}
              />

              <Button className="mt-10" disabled={url === "" || loading || !isVerified} onClick={handleAnalizePost}>Analize</Button>
            </div>

          ) : (
            <Button className="mt-10" disabled={url === "" || loading} onClick={handleAnalizePost}>Analize</Button>

          )
          }
        </CardContent>
        <CardFooter className="grid">
        </CardFooter>
      </MagicCard>
    </Card>
  )
}