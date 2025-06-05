

interface TruncateTextProps {
  text: string;
}



export default function TruncateText({ text }: TruncateTextProps) {
  return (
    <>
      <span className="xs:inline sm:hidden">{text.length <= 22 ? text : text.slice(0, 22) + "..."}</span>
      <span className="hidden sm:inline md:hidden">{text.length <= 62 ? text : text.slice(0, 65) + "..."}</span>
      <span className="hidden md:inline lg:hidden">{text.length <= 27 ? text : text.slice(0, 30) + "..."}</span>
      <span className="hidden lg:inline xl:hidden">{text.length <= 47 ? text : text.slice(0, 50) + "..."}</span>
      <span className="hidden xl:inline">{text.length <= 32 ? text : text.slice(0, 35) + "..."}</span>
      </>
  )
}