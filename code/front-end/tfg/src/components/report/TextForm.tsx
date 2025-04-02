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

export default function TextForm() {

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
        <FullScreenLoader words={["Adding context...", "Analyzing text...", "Generating report..."]} />
      )}

      <MagicCard gradientColor="#D9D9D955">
        <CardHeader />
        <CardContent>
          <div>
            <Label>
              Content <span className="text-red-500">&#42;</span>
            </Label>
            <Textarea
              placeholder="Write your report here"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              This text will be analyzed and added to the report
            </p>
          </div>

          <div className="mt-10">
            <Label>
              Source <span className="text-red-500">&#42;</span>
            </Label>
            <Input
              placeholder="Write the original source here"
              value={source}
              onChange={handleSourceChange}
            />
            <p className="text-sm text-muted-foreground">
              This is the original source of the content, for example an URL
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
            value={context}
            onChange={(e) => setContext(e.target.value)}
          />
          <p className="text-sm text-muted-foreground">
            This text will be added as context to the report, making the result more accurate
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
              Analyze
            </Button>
          )}
        </CardContent>
        <CardFooter className="grid"></CardFooter>
      </MagicCard>
    </Card>
  );
}
