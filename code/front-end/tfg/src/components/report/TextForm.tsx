

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox"

import { Label } from "@radix-ui/react-dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MagicCard } from "@/components/magicui/magic-card";

import { useReport } from "@/hooks/useReport";

import axios from "axios";

export default function TextForm() {
    const {
        disableContextText,
        setDisableContextText,
        setContent,
        content,
        setContext,
        context,
        setSource,
        source
    } = useReport();

    const handleAnalizeText = async (e: React.FormEvent) => {
        e.preventDefault();
    
        const formData = new FormData();
        formData.append("source", source);
        formData.append("context", context);
        formData.append("content", content);
        formData.append("type", "text");
    
        try {
          const response = await axios.post("/api/ocr", formData);
          const data = response.data;
          alert(data.result.description);
        } catch (error) {
          console.error("Error al subir la imagen:", error);
        }
      };


    return (
        <Card className="max-w-7xl">
            <MagicCard gradientColor="#D9D9D955">
                <CardHeader />
                <CardContent>
                    <div>
                        <Label >Content</Label>
                        <Textarea placeholder="Write your report here" onChange={(e) => setContent(e.target.value)} />
                        <p className="text-sm text-muted-foreground">
                            This text will be analyzed and a added to the report
                        </p>
                    </div>
                    <div className="mt-5">
                        <Label >Source</Label>
                        <Input placeholder="Write the original source here" onChange={(e) => setSource(e.target.value)} />
                        <p className="text-sm text-muted-foreground">
                            This is the original source of the content, for example an URL
                        </p>
                    </div>

                    <div className="items-top flex space-x-2 mt-10 mb-5">
                        <Checkbox id="context" onCheckedChange={() => setDisableContextText(prev => !prev)} />
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
                        disabled={disableContextText}
                        className="peer-disabled:bg-gray-100"
                        onChange={(e) => setContext(e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                        This text will be added as context to the report
                    </p>
                    <Button className="mt-10" onClick={handleAnalizeText}>Analize</Button>
                </CardContent>
                <CardFooter className="grid">
                </CardFooter>
            </MagicCard>
        </Card>
    )
}