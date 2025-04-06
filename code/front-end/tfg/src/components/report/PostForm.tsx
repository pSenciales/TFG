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

export default function PostForm() {
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
            "Adding context...",
            "Analyzing text...",
            "Generating report...",
          ]}
        />
      )}

      <MagicCard gradientColor="#D9D9D955">
        <CardHeader />
        <CardContent>
          <Label>
            URL <span className="text-red-500">&#42;</span>
          </Label>
          <Input
            placeholder="e.g https://x.com/user/status/1234567890"
            onChange={handleUrlChange}
            required
            className="w-[50%]"
          />
          <p className="text-sm text-muted-foreground">
            The text in this post will be analyzed. If the post has images, the first one
            will be used as context.
          </p>
          {urlCheck !== "" && (
            <FadeIn>
              <p className="text-red-500 text-sm">{urlCheck}</p>
            </FadeIn>

          )}

          <Label className="mt-10">Context</Label>
          <Textarea
            placeholder="Write the context here"
            className="peer-disabled:bg-gray-100"
            onChange={(e) => setContext(e.target.value)}
          />
          <p className="text-sm text-muted-foreground">
            This text will be added as context to the report, making the report more accurate.
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
              Analyze
            </Button>
          )}
        </CardContent>
        <CardFooter className="grid" />
      </MagicCard>
    </Card>
  )
}
