
"use client";
import { Tabs } from "@/components/ui/tabs"

import FadeIn from "@/components/fadeIn";

import { useReport } from "@/hooks/useReport";

import TextForm from "@/components/report/TextForm";
import ImageForm from "@/components/report/ImageForm";
import PostForm from "@/components/report/PostForm";

import { useTranslations } from "next-intl";

export default function Report() {

  const t = useTranslations('reports');


  const {
    loading,
    setContext,
    setContent,
    setUrl,
    setView,
    setSource
  } = useReport();

  const tabs = [
    {
      title: t('tabs.text.title'),
      value: "text",
      content: (
        <TextForm />
      )
    },
    {
      title: t('tabs.image.title'),
      value: "image",
      content: (
        <ImageForm />
      )

    },
    {
      title: t('tabs.post.title'),
      value: "post",
      content: (
        <PostForm />
      )
    },
  ];

  // Un mini-componente que muestra el overlay de carga
  function FullScreenLoader() {
    return (
      <div style={overlayStyle}>
        <div style={loaderStyle}>Cargando...</div>
      </div>
    );
  }

  // Estilos básicos para el overlay y el contenido centrado
  const overlayStyle = {
    position: "fixed" as const,
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    color: "#fff",
    fontSize: "1.5rem",
  };

  const loaderStyle = {
    padding: "1rem 2rem",
    backgroundColor: "#222",
    borderRadius: "8px",
  };

  return (
    <FadeIn duration={0.5}>
      {loading && <FullScreenLoader />}

      <div className="w-full grid place-items-center">
        <h1 className="text-3xl font-bold mt-20 text-center">
          {t('title')}
        </h1>
        <div className="w-full max-w-7xl mt-10">
          <Tabs
            tabs={tabs}
            loading={loading}
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
