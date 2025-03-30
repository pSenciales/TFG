import { useState } from "react";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { FileUpload } from "@/components/ui/file-upload";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MagicCard } from "@/components/magicui/magic-card";
import { Input } from "@/components/ui/input";
import { useReport } from "@/hooks/useReport";
import FullScreenLoader from "./FullScreenLoader";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import { useSession } from "next-auth/react";

export default function ImageForm() {
    const { data: session } = useSession();

    const {
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
        captchaToken
    } = useReport();
    const [files, setFiles] = useState<File[]>([]);
    const handleFileUpload = (files: File[]) => {
        setFiles(files);
        console.log(files);
    };
    console.log(files);

    const handleAnalizeImage = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        if (!files) return;

        const formData = new FormData();
        formData.append("captchaToken", captchaToken)
        formData.append("file", files[0]);
        formData.append("context", context);
        formData.append("source", source);
        formData.append("type", "image");

        try {
            const response = await axios.post("/api/analize", formData);
            const data = response.data;
            alert("The text is: " + data.content + "\nReasoning: " + data.reasoning);
        } catch (error) {
            console.error("Error al subir la imagen:", error);
        }finally{
            if (recaptchaRef.current) {
                recaptchaRef.current.reset();
            }
            setLoading(false);
        }
    };

    return (
        <Card className="max-w-7xl">
            {loading && <FullScreenLoader />}
            <MagicCard gradientColor="#D9D9D955">
                <CardHeader />
                <CardContent>
                    <div className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg text-center">
                        <FileUpload onChange={handleFileUpload} />
                    </div>
                    <div className="mt-20">
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

                            <Button className="mt-10" disabled={files.length !== 1 || source === "" || loading || !isVerified} onClick={handleAnalizeImage}>Analize</Button>
                        </div>

                    ) : (
                        <Button className="mt-10" disabled={files.length !== 1 || source === "" || loading} onClick={handleAnalizeImage}>Analize</Button>

                    )
                    }
                </CardContent>
                <CardFooter className="grid">
                </CardFooter>
            </MagicCard>
        </Card>
    )
}