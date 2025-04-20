

interface TruncateTextProps {
  text: string;
}



export default function TruncateText({text}:TruncateTextProps){
    return (
        <>
        <span className="sm:hidden">{text.length <= 11 ? text : text.slice(0, 8) + "..."}</span>
                        <span className="hidden xs:inline sm:hidden">{text.length <= 18 ? text : text.slice(0, 15) + "..."}</span>
                        <span className="hidden sm:inline md:hidden">{text.length <= 21 ? text : text.slice(0, 18) + "..."}</span>
                        <span className="hidden md:inline lg:hidden">{text.length <= 15 ? text : text.slice(0, 14) + "..."}</span>
                        <span className="hidden lg:inline">{text.length <= 18 ? text : text.slice(0, 21) + "..."}</span></>
    )
}