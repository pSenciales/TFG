"use client";

import { useState } from "react";

export function useReport() {
    // Estado contexto
    const [disableContextText, setDisableContextText] = useState(true);
    const [disableContextImage, setDisableContextImage] = useState(true);
    const [disableContextPost, setDisableContextPost] = useState(true);
    
    // Campos del formulario
  const [context, setContext] = useState("");
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");
  const [source, setSource] = useState("");
  const [view, setView] = useState("text");


  return {
    disableContextText,
    setDisableContextText,
    disableContextImage,
    setDisableContextImage,
    disableContextPost,
    setDisableContextPost,
    context,
    setContext,
    content,
    setContent,
    url,
    setUrl,
    view,
    setView,
    source, 
    setSource
  };
}
