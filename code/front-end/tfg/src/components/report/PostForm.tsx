

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox"

import { Label } from "@radix-ui/react-dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MagicCard } from "@/components/magicui/magic-card";

import { useReport } from "@/hooks/useReport";

import axios from "axios";

export default function PostForm() {
    const {
        disableContextPost,
        setDisableContextPost,
        setUrl,
        url,
        setContext,
        context
      } = useReport();
    
      const handleAnalizePost = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("url", url);
        formData.append("context", context);
        formData.append("type", "post");
    
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
            <Label >URL<span className="text-red-500"> &#42;</span></Label>
            <Textarea placeholder="Write your report here" onChange={(e) => setUrl(e.target.value)} required/>
            <p className="text-sm text-muted-foreground">
              This text will be analyzed and a added to the report, if the post has images, the first one will be used as context
            </p>
            <div className="items-top flex space-x-2 mt-10 mb-5">
              <Checkbox id="context" onCheckedChange={() => setDisableContextPost(prev => !prev)} />
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
              disabled={disableContextPost}
              className="peer-disabled:bg-gray-100"
              onChange={(e) => setContext(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              This text will be added as context to the report
            </p>
            <Button className="mt-10" onClick={handleAnalizePost}>Analize</Button>
          </CardContent>
          <CardFooter className="grid">
          </CardFooter>
        </MagicCard>
      </Card>
         )
}