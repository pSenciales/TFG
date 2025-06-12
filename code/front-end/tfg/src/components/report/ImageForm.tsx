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

import { useTranslations } from "next-intl"

export default function ImageForm() {
  const t = useTranslations('reports');
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
          words={[t('tabs.image.loading.text1'), t('tabs.image.loading.text2'), t('tabs.image.loading.text3'), t('tabs.image.loading.text4')]}
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
              {t('source.label')} <span className="text-red-500">&#42;</span>
            </Label>
            <Input               placeholder={t('source.placeholder')} onChange={handleSourceChange} />
            <p className="text-sm text-muted-foreground">
              {t('source.description')}
            </p>
            {sourceCheck !== "" && (
              <FadeIn>
              <p className="text-red-500 text-sm">{sourceCheck}</p>
            </FadeIn>
          )}

          </div>

          <Label className="mt-10">{t('context.label')}</Label>
          <Textarea
            placeholder={t('context.placeholder')}
            className="peer-disabled:bg-gray-100"
            onChange={(e) => setContext(e.target.value)}
          />
          <p className="text-sm text-muted-foreground">
            {t('context.description')}
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
              {t('analyze')}
            </Button>
          )}
        </CardContent>
        <CardFooter className="grid" />
      </MagicCard>
    </Card>
  )
}
