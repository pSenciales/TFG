import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MagicCard } from "@/components/magicui/magic-card";
import { useSession } from "next-auth/react";
import { useReport } from "@/hooks/useReport";
import FullScreenLoader from "./FullScreenLoader";
import ReCAPTCHA from "react-google-recaptcha";

import axios from "axios";

export default function TextForm() {
    
    const { data: session } = useSession();
    const {
        setContent,
        content,
        setContext,
        context,
        setSource,
        source,
        setLoading,
        loading,
        recaptchaRef,
        handleChangeRecaptcha,
        handleExpired,
        isVerified,
        captchaToken,

    } = useReport();

    const handleAnalizeText = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append("captchaToken", captchaToken)
        formData.append("source", source);
        formData.append("context", context);
        formData.append("content", content);
        formData.append("type", "text");

        try {
            const response = await axios.post("/api/analize", formData);
            const data = response.data;
            alert("The text is: " + data.content + "\nReasoning: " + data.reasoning);
        } catch (error) {
            console.error("Error al analizar el texto:", error);
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
            words={["Adding context...","Analizing text...", "Generating report..."]} 
            />}
            <MagicCard gradientColor="#D9D9D955">
                <CardHeader />
                <CardContent>
                    <div>
                        <Label >Content <span className="text-red-500">&#42;</span></Label>
                        <Textarea placeholder="Write your report here" onChange={(e) => setContent(e.target.value)} />
                        <p className="text-sm text-muted-foreground">
                            This text will be analyzed and a added to the report
                        </p>
                    </div>
                    <div className="mt-10">
                        <Label >Source <span className="text-red-500">&#42;</span></Label>
                        <Input placeholder="Write the original source here" onChange={(e) => setSource(e.target.value)} />
                        <p className="text-sm text-muted-foreground">
                            This is the original source of the content, for example an URL
                        </p>
                    </div>
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

                            < Button disabled={content === "" || source === "" || loading || !isVerified} className="mt-10" onClick={handleAnalizeText}>Analize</Button>
                        </div>

                    ) : (


                        < Button disabled={content === "" || source === "" || loading} className="mt-10" onClick={handleAnalizeText}>Analize</Button>
                    )

                    }
                </CardContent>
                <CardFooter className="grid">
                </CardFooter>
            </MagicCard>
        </Card >
    )
}