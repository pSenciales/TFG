import { ThreeDot } from "react-loading-indicators";
import FadingText from '@/components/fadingText';

type FullScreenLoaderProps = {
    words: string[];
};



export default function FullScreenLoader({
    words
}: FullScreenLoaderProps) {

    return (
        <div
            className="
        fixed
        top-0
        left-0
        w-screen
        h-screen
        flex
        items-center
        justify-center
        z-[9999]
        bg-white/30      
        backdrop-blur-sm 
        backdrop-saturate-150
      "
        >
            <div className="grid justify-items-center py-2 px-4 text-center text-sm rounded-xl w-[20%] w-full ">
                
                <ThreeDot color="#000000" size="large" />
                <FadingText
                    texts={words}
                    interval={5000}
                    fadeDuration={0.4}
                    className="text-center text-md mt-2"
                />

            </div>
        </div>
    );
}
