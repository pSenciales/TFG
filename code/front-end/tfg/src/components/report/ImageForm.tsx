import { useSession } from "next-auth/react"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { FileUpload } from "@/components/ui/file-upload"
import { Label } from "@radix-ui/react-dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MagicCard } from "@/components/magicui/magic-card"

import { useReport } from "@/hooks/useReport"
import FullScreenLoader from "./FullScreenLoader"
import EmailDialog from "./EmailDialog"
import FadeIn from "../fadeIn"

export default function ImageForm() {
  const { data: session } = useSession()
  const {
    setContext,
    source,
    loading,
    isVerified,
    handleAnalyzeImage,
    email,
    emailCheck,
    handleEmailChange,
    recaptchaRef,
    handleChangeRecaptcha,
    handleExpired,
    setFiles,
    files,
    handleSourceChange,
    sourceCheck
  } = useReport()

  const handleFileUpload = (newFiles: File[]) => {
    setFiles(newFiles)
    console.log(newFiles)
  }

  return (
    <Card className="max-w-7xl">
      {loading && (
        <FullScreenLoader
          words={["Extracting text...", "Adding context...", "Analyzing text...", "Generating report..."]}
        />
      )}

      <MagicCard gradientColor="#D9D9D955">
        <CardHeader />
        <CardContent>
          <div className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg text-center">
            <FileUpload onChange={handleFileUpload} />
          </div>

          <div className="mt-20">
            <Label>
              Source <span className="text-red-500">&#42;</span>
            </Label>
            <Input               placeholder="e.g https://example.com" onChange={handleSourceChange} />
            <p className="text-sm text-muted-foreground">
              This is the original source of the content, for example a URL.
            </p>
            {sourceCheck !== "" && (
              <FadeIn>
              <p className="text-red-500 text-sm">{sourceCheck}</p>
            </FadeIn>
          )}

          </div>

          <Label className="mt-10">Context</Label>
          <Textarea
            placeholder="Write the context here"
            className="peer-disabled:bg-gray-100"
            onChange={(e) => setContext(e.target.value)}
          />
          <p className="text-sm text-muted-foreground">
            This text will be added as context to the report, making the result more accurate.
          </p>

          {!session ? (
            <EmailDialog
              type="image"
              loading={loading}
              isVerified={isVerified}
              email={email}
              emailCheck={emailCheck}
              handleEmailChange={handleEmailChange}
              handleAnalyze={handleAnalyzeImage}
              recaptchaRef={recaptchaRef}
              handleChangeRecaptcha={handleChangeRecaptcha}
              handleExpired={handleExpired}
              params={[source]}
              checkURL={sourceCheck}
              files={files}
            />
          ) : (
            <Button
              className="mt-10"
              disabled={files.length !== 1 || sourceCheck !== "" || source === "" || loading}
              onClick={handleAnalyzeImage}
            >
              Analyze
            </Button>
          )}
        </CardContent>
        <CardFooter className="grid" />
      </MagicCard>
    </Card>
  )
}
