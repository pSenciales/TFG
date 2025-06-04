import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Label } from "@radix-ui/react-dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MagicCard } from "@/components/magicui/magic-card"
import { useSession } from "next-auth/react"

import { useReport } from "@/hooks/useReport"
import FullScreenLoader from "./FullScreenLoader"
import EmailDialog from "./EmailDialog"
import FadeIn from "../fadeIn"

import { useTranslations } from "next-intl"

export default function PostForm() {
  const t = useTranslations('reports');
  const { data: session } = useSession()
  const {
    url,
    setContext,
    loading,
    isVerified,
    handleAnalyzePost,
    email,
    emailCheck,
    handleEmailChange,
    recaptchaRef,
    handleChangeRecaptcha,
    handleExpired,
    handleUrlChange,
    urlCheck
  } = useReport()
  return (
    <Card className="max-w-7xl">
      {loading && (
        <FullScreenLoader
          words={[
            "Scraping tweet...",
            t("tabs.post.loading.text1"),
            t("tabs.post.loading.text2"),
            t("tabs.post.loading.text3"),
          ]}
        />
      )}

      <MagicCard gradientColor="#D9D9D955">
        <CardHeader />
        <CardContent>
          <Label>
            {t('url.label')} <span className="text-red-500">&#42;</span>
          </Label>
          <Input
            placeholder={t('url.placeholder')}
            onChange={handleUrlChange}
            required
            className="w-[50%]"
          />
          <p className="text-sm text-muted-foreground">
            {t('url.description')}
          </p>
          {urlCheck !== "" && (
            <FadeIn>
              <p className="text-red-500 text-sm">{urlCheck}</p>
            </FadeIn>

          )}

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
              type="post"
              loading={loading}
              isVerified={isVerified}
              email={email}
              emailCheck={emailCheck}
              handleEmailChange={handleEmailChange}
              handleAnalyze={handleAnalyzePost}
              recaptchaRef={recaptchaRef}
              handleChangeRecaptcha={handleChangeRecaptcha}
              handleExpired={handleExpired}
              params={[url]}
              checkURL={urlCheck}
            />
          ) : (
            <Button className="mt-10" disabled={url === "" || urlCheck !== "" || loading} onClick={handleAnalyzePost}>
              {t('analyze')}
            </Button>
          )}
        </CardContent>
        <CardFooter className="grid" />
      </MagicCard>
    </Card>
  )
}
