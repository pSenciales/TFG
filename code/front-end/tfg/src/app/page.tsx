"use client";
import SplitText from '@/components/bits/SplitText';
import SpotlightCard from '@/components/bits/SpotlightCard';
import { Button } from "@/components/ui/button";
import { Particles } from "@/components/magicui/particles";

export default function Home() {
  return (
    <div className="grid grid-cols-5 grid-rows-3 gap-0 mt-20">
      <div className="col-span-5 row-span-2 flex items-center justify-center">
        <div className="relative flex justify-center items-center w-[80%] max-w-10xl h-[100%] max-h-2xl flex items-center justify-center border-xl border-silver bg-gradient-to-r from-light-gray to-light-blue rounded-t-xl rounded-b-none">
          <div className="flex flex-col items-center justify-center absolute text-shadow-md">
            <img src="/logo-no-bg.png" alt="logo" className="size-[30%] mx-auto" />
            <h1 className="text-5xl font-bold text-black">Introducing Fairplay360</h1>
            <p className="text-lg font-bold text-black">A platform to report and document human rights violations</p>
            <SplitText text='AI powered' delay={200} className="text-md font-bold text-black" />
          </div>
          <Particles
            className="absolute inset-0 z-0"
            quantity={300}
            ease={50}
            color={"#000000"}
          />
        </div>

      </div>
      <div className="col-span-5 row-start-3 flex items-center justify-center">
        <div className='grid grid-cols-3 grid-rows-1 gap-0 w-[80%] max-w-10xl size-full'>
          <div className='col-span-2 bg-white border-b border-l border-silver flex items-center justify-center size-full rounded-bl-xl shadow-lg'>
            {/* Contenido de la primera columna */}
          </div>
          <div className='col-start-3 border-x border-b border-silver bg-white flex items-center justify-center size-full rounded-br-xl shadow-lg'>
            <SpotlightCard
              className='w-full h-full bg-white border-none rounded-br-xl rounded-t-none rounded-bl-none'
              spotlightColor={`rgba(117, 197, 255, 0.5)`}
            >
              <div className="flex flex-col">
                <h1 className="text-md text-gray"> Fairplay360 aims to combat hate speech through AI-driven moderation. We seek to create a safer digital space for fans, players, and organizations.</h1>
                <p className="text-lg font-bold text-black mt-1">Start now</p>
                <Button className="text-white font-bold py-2 px-4 rounded mt-4 rounded-xl">Report here</Button>
              </div>
            </SpotlightCard>
          </div>
        </div>
      </div>
    </div>
  );
}