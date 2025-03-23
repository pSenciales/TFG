

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox"

import { Label } from "@radix-ui/react-dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MagicCard } from "@/components/magicui/magic-card";

import { useReport } from "@/hooks/useReport";


export default function PostForm() {
    const {
        disableContextPost,
        setDisableContextPost,
        setUrl,
        setContext
      } = useReport();

    return (
        <Card className="max-w-7xl">
        <MagicCard gradientColor="#D9D9D955">
          <CardHeader />
          <CardContent>
            <Label >URL</Label>
            <Textarea placeholder="Write your report here" onChange={(e) => setUrl(e.target.value)} />
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
            <Button className="mt-10">Analize</Button>
          </CardContent>
          <CardFooter className="grid">
          </CardFooter>
        </MagicCard>
      </Card>
         )
}