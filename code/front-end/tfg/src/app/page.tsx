import NavBar from "./components/navbar";
import Form from "./components/form";
import FormHateDetect from "./components/formHateDetect";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

export default function Landing() {
  return (
    <div>
      <NavBar />
      <div className="flex justify-center mt-10">
      <Tabs defaultValue="ocr" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="ocr">OCR</TabsTrigger>
          <TabsTrigger value="hate-detect">Hate Detection</TabsTrigger>
        </TabsList>
        <TabsContent value="ocr">
          <Form />
        </TabsContent>
        <TabsContent value="hate-detect">
          <FormHateDetect />
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}
