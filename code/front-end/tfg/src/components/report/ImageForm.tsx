import { useState } from "react";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox"
import { FileUpload } from "@/components/ui/file-upload";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MagicCard } from "@/components/magicui/magic-card";

import { useReport } from "@/hooks/useReport";

export default function ImageForm() {

    const {
        disableContextImage,
        setDisableContextImage,
        setContext
    } = useReport();
    const [files, setFiles] = useState<File[]>([]);
    const handleFileUpload = (files: File[]) => {
        setFiles(files);
        console.log(files);
    };
    console.log(files);
    return (
        <Card className="max-w-7xl">
            <MagicCard gradientColor="#D9D9D955">
                <CardHeader />
                <CardContent>
                    <div className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg text-center">
                        <FileUpload onChange={handleFileUpload} />
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
                    <Button className="mt-10">Analize</Button>
                </CardContent>
                <CardFooter className="grid">
                </CardFooter>
            </MagicCard>
        </Card>
    )
}