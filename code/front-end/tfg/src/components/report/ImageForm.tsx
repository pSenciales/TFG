import { useState } from "react";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox"
import { FileUpload } from "@/components/ui/file-upload";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MagicCard } from "@/components/magicui/magic-card";
import { Input } from "@/components/ui/input";
import { useReport } from "@/hooks/useReport";
import axios from "axios";

export default function ImageForm() {

    const {
        disableContextImage,
        setDisableContextImage,
        setContext,
        context,
        setSource,
        source
    } = useReport();
    const [files, setFiles] = useState<File[]>([]);
    const handleFileUpload = (files: File[]) => {
        setFiles(files);
        console.log(files);
    };
    console.log(files);

    const handleAnalizeImage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!files) return;
    
        const formData = new FormData();
        formData.append("file", files[0]);
        formData.append("context", context);
        formData.append("source", source);
        formData.append("type", "image");
    
        try {
            const response = await axios.post("/api/analize", formData);
            const data = response.data;
            alert("The text is: "+data.content+"\nReasoning: "+data.reasoning);
        } catch (error) {
          console.error("Error al subir la imagen:", error);
        }
      };

    return (
        <Card className="max-w-7xl">
            <MagicCard gradientColor="#D9D9D955">
                <CardHeader />
                <CardContent>
                    <div className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg text-center">
                        <FileUpload onChange={handleFileUpload} />
                    </div>
                    <div className="mt-5">
                        <Label >Source</Label>
                        <Input placeholder="Write the original source here" onChange={(e) => setSource(e.target.value)} />
                        <p className="text-sm text-muted-foreground">
                            This is the original source of the content, for example an URL
                        </p>
                    </div>
                    <div className="items-top flex space-x-2 mt-10 mb-5">
                        <Checkbox id="context" onCheckedChange={() => setDisableContextImage(prev => !prev)} />
                        <div className="grid gap-1.5 leading-none">
                            <label
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Add context
                            </label>
                            <p className="text-sm text-muted-foreground">
                                This will make the report more accurate
                            </p>
                        </div>
                    </div>
                    <Label>Context</Label>
                    <Textarea
                        placeholder="Write the context here"
                        disabled={disableContextImage}
                        className="peer-disabled:bg-gray-100"
                        onChange={(e) => setContext(e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                        This text will be added as context to the report
                    </p>
                    <Button className="mt-10" onClick={handleAnalizeImage}>Analize</Button>
                </CardContent>
                <CardFooter className="grid">
                </CardFooter>
            </MagicCard>
        </Card>
    )
}