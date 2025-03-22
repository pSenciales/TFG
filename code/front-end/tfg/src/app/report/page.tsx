"use client";

import { useState } from "react";

import { Tabs } from "@/components/ui/tabs"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { FileUpload } from "@/components/ui/file-upload";
import { Checkbox } from "@/components/ui/checkbox"

import { Label } from "@radix-ui/react-dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MagicCard } from "@/components/magicui/magic-card";

import FadeIn from "@/components/fadeIn";


export default function Report() {

  const [disableContext, setDisableContext] = useState(true);


  const [files, setFiles] = useState<File[]>([]);
  const handleFileUpload = (files: File[]) => {
    setFiles(files);
    console.log(files);
  };

  const tabs = [
    {
      title: "Text",
      value: "text",
      content: (<Card className="max-w-7xl">
        <MagicCard gradientColor="#D9D9D955">
          <CardHeader />
          <CardContent>
            <Label >Content</Label>
            <Textarea placeholder="Write your report here" className=" " />
            <p className="text-sm text-muted-foreground">
              This text will be analyzed and a added to the report
            </p>
            <div className="items-top flex space-x-2 mt-10 mb-5">
              <Checkbox id="context" onCheckedChange={() => setDisableContext(!disableContext)} />
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
              disabled={disableContext}
              className="peer-disabled:bg-gray-100"
            />
            <p className="text-sm text-muted-foreground">
              This text will be added as context to the report
            </p>
            <Button className="mt-10">Analize</Button>
          </CardContent>
          <CardFooter className="grid">
          </CardFooter>
        </MagicCard>
      </Card>)
    },
    {
      title: "Image",
      value: "image",
      content: (
        <Card className="max-w-7xl">
          <MagicCard gradientColor="#D9D9D955">
            <CardHeader />
            <CardContent>
              <div className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg text-center">
                <FileUpload onChange={handleFileUpload} />
              </div>
              <div className="items-top flex space-x-2 mt-10 mb-5">
                <Checkbox id="context" onCheckedChange={() => setDisableContext(!disableContext)} />
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
                disabled={disableContext}
                className="peer-disabled:bg-gray-100"
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

    },
    {
      title: "X's post",
      value: "post",
      content: (
        <Card className="max-w-7xl">
          <MagicCard gradientColor="#D9D9D955">
            <CardHeader />
            <CardContent>
              <Label >URL</Label>
              <Textarea placeholder="Write your report here" className=" " />
              <p className="text-sm text-muted-foreground">
                This text will be analyzed and a added to the report, if the post has images, the first one will be used as context
              </p>
              <div className="items-top flex space-x-2 mt-10 mb-5">
                <Checkbox id="context" onCheckedChange={() => setDisableContext(!disableContext)} />
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
                disabled={disableContext}
                className="peer-disabled:bg-gray-100"
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
    },
  ];

  return (
    <FadeIn duration={0.5}>

      <div className="w-full grid place-items-center no-visible-scrollbar">
        <h1 className="text-3xl font-bold mt-20 text-center">
          Create a report from this different media
        </h1>
        <div className="w-full max-w-7xl mt-10">
          <Tabs tabs={tabs} />
        </div>
      </div>
    </FadeIn>
  );
}
