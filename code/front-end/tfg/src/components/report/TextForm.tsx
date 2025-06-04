// TextForm.tsx
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MagicCard } from "@/components/magicui/magic-card";
import { useReport } from "@/hooks/useReport";
import FullScreenLoader from "./FullScreenLoader";
import EmailDialog from "./EmailDialog";
import FadeIn from "../fadeIn";

import { useTranslations } from "next-intl";

export default function TextForm() {
  const t = useTranslations('reports');

  const {
    loading,
    content,
    setContent,
    source,
    context,
    setContext,
    recaptchaRef,
    handleChangeRecaptcha,
    handleExpired,
    isVerified,
    handleAnalyzeText,
    email,
    emailCheck,
    handleEmailChange,
    handleSourceChange,
    sourceCheck,
    session
  } = useReport();

  return (
    <Card className="max-w-7xl">
      {loading && (
        <FullScreenLoader words={[t('tabs.text.loading.text1'), t('tabs.text.loading.text2'), t('tabs.text.loading.text3')]} />
      )}

      <MagicCard gradientColor="#D9D9D955">
        <CardHeader />
        <CardContent>
          <div>
            <Label>
              {t('content.label')} <span className="text-red-500">&#42;</span>
            </Label>
            <Textarea
              placeholder={t('content.placeholder')}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              {t('content.description')}
            </p>
          </div>

          <div className="mt-10">
            <Label>
              {t('source.label')} <span className="text-red-500">&#42;</span>
            </Label>
            <Input
              placeholder={t('source.placeholder')}
              value={source}
              onChange={handleSourceChange}
            />
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
            value={context}
            onChange={(e) => setContext(e.target.value)}
          />
          <p className="text-sm text-muted-foreground">
            {t('context.description')}
          </p>
          {!session ? (
            <EmailDialog
              type="text"
              loading={loading}
              isVerified={isVerified}
              email={email}
              emailCheck={emailCheck}
              handleEmailChange={handleEmailChange}
              handleAnalyze={handleAnalyzeText}
              recaptchaRef={recaptchaRef}
              handleChangeRecaptcha={handleChangeRecaptcha}
              handleExpired={handleExpired}
              params={[content, source]}
              checkURL={sourceCheck}
            />
          ) : (
            <Button
              disabled={content === "" || source === "" || sourceCheck !== "" || loading}
              className="mt-10"
              onClick={handleAnalyzeText}
            >
              {t('analyze')}
            </Button>
          )}
        </CardContent>
        <CardFooter className="grid"></CardFooter>
      </MagicCard>
    </Card>
  );
}
