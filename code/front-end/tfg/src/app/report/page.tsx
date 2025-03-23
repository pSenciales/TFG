
"use client";
import { Tabs } from "@/components/ui/tabs"

import FadeIn from "@/components/fadeIn";

import { useReport } from "@/hooks/useReport";

import TextForm from "@/components/report/TextForm";
import ImageForm from "@/components/report/ImageForm";
import PostForm from "@/components/report/PostForm";

export default function Report() {



  const {
    setDisableContextText,
    setDisableContextImage,
    setDisableContextPost,
    setContext,
    setContent,
    setUrl,
    setView,
    setSource
  } = useReport();

  const tabs = [
    {
      title: "Text",
      value: "text",
      content: (
        <TextForm/>
      )
    },
    {
      title: "Image",
      value: "image",
      content: (
       <ImageForm/>
      )

    },
    {
      title: "X's post",
      value: "post",
      content: (
        <PostForm/>
      )
    },
  ];


  return (
    <FadeIn duration={0.5}>

      <div className="w-full grid place-items-center">
        <h1 className="text-3xl font-bold mt-20 text-center">
          Create a report from this different media
        </h1>
        <div className="w-full max-w-7xl mt-10">
          <Tabs
            tabs={tabs}
            setDisableContextText={setDisableContextText}
            setDisableContextImage={setDisableContextImage}
            setDisableContextPost={setDisableContextPost}
            setView={setView}
            setContext={setContext}
            setContent={setContent}
            setUrl={setUrl}
            setSource={setSource}
          />
        </div>
      </div>
    </FadeIn>
  );
}
