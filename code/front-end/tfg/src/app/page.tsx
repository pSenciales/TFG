"use client";
import { useRef } from 'react';
import { motion, useInView } from "framer-motion";
import SplitText from '@/components/bits/SplitText';
import ScrollFloat from '@/components/bits/ScrollFloat';
import { ArrowRightIcon } from '@radix-ui/react-icons';
import { Particles } from '@/components/magicui/particles';
import { AnimatedShinyText } from '@/components/magicui/animated-shiny-text';
import RotatingText from '@/components/bits/RotatingText';
import { WarpBackground } from '@/components/magicui/warp-background';
import Stepper, { Step } from '@/components/bits/Stepper';
import Image from 'next/image'
import FadeIn from '@/components/fadeIn';
export default function Home() {
  const stepperRef = useRef(null);
  const isInView = useInView(stepperRef, { once: true, margin: "0px 0px -20% 0px" });

  return (
    <div className='flex-col justify-center items-center'>
      <FadeIn duration={0.4}>
      {/* Layout para pantallas pequeñas (mobile) */}
      <div className="block md:hidden w-full px-4 mt-10">
        {/* Sección Superior (versión mobile) */}
        <div className="relative border-t border-x border-silver  bg-gradient-to-r from-light-gray to-light-blue rounded-t-xl overflow-hidden flex flex-col items-center justify-center">
          <Particles
            className="absolute inset-0 z-0"
            quantity={300}
            ease={50}
            color="#000000"
          />
          <div className="absolute flex flex-col items-center justify-center text-shadow-md">
            <Image
              src="/logo-no-bg.png"
              alt="logo"
              className="mx-auto"
              width={100}
              height={100}
            />
            <h1 className="text-lg sm:text-2xl font-bold text-black mt-4">
              Introducing Fairplay360
            </h1>
            <p className="text-xs sm:text-md font-bold text-black mt-2">
              A platform to report and document human rights violations
            </p>
            <SplitText
              text="AI powered"
              delay={200}
              className="text-xs font-bold text-black mt-2"
            />
          </div>
          {/* Controla la altura */}
          <div className="w-full h-[200px]" />
        </div>

        {/* Sección Inferior (versión mobile) */}
        <div className="flex flex-col">
          {/* Bloque RotatingText */}
          <div className="bg-white border border-silver">
            <WarpBackground
              className="w-full h-full bg-white rounded-xl flex items-center justify-center"
              beamDuration={20}
              beamDelayMax={20}
              beamDelayMin={0}
              beamsPerSide={10}
              perspective={10}
            >
              <RotatingText
                texts={["Analize", "Report", "Fairplay"]}
                mainClassName="w-full text-black text-3xl font-bold overflow-hidden py-1 text-center"
                staggerFrom="last"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-120%" }}
                staggerDuration={0.025}
                splitLevelClassName="overflow-hidden pb-1"
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
                rotationInterval={2000}
              />
            </WarpBackground>
          </div>

          {/* Bloque Call to Action */}
          <div className="bg-white border-b border-x border-silver rounded-b-xl shadow-lg p-4 flex flex-col items-center">
            <p className="text-sm text-gray-600 text-center">
              Fairplay360 aims to combat hate speech through AI-driven moderation.
              We seek to create a safer digital space for fans, players, and organizations.
            </p>
            <p className="text-lg font-bold text-black mt-2 text-center">
              Start now
            </p>
            <button
              onClick={() => (window.location.href = "/report")}
              className="mt-4"
            >
              <AnimatedShinyText
                className="w-[80%] inline-flex items-center justify-center px-4 py-1 border-2 rounded-xl transition ease-out hover:text-neutral-600 hover:duration-300 mx-auto"
              >
                <span>📝 Report here</span>
                <ArrowRightIcon className="ml-1 transition-transform duration-300 ease-in-out" />
              </AnimatedShinyText>
            </button>
          </div>
        </div>
      </div>

      {/* Layout para pantallas medianas o mayores (desktop) */}
      <div className="hidden md:block w-full mt-20">
        <div className="grid grid-cols-5 grid-rows-3 gap-0 max-h-7xl">
          {/* Sección Superior (versión desktop) */}
          <div className="col-span-5 row-span-2 flex items-center justify-center">
            <div className="relative flex justify-center items-center w-[80%] max-w-10xl h-full max-h-2xl border border-silver bg-gradient-to-r from-light-gray to-light-blue rounded-t-xl rounded-b-none overflow-hidden">
              <div className="absolute flex flex-col items-center justify-center text-shadow-md">
                <Image
                  src="/logo-no-bg.png"
                  alt="logo"
                  className="mx-auto"
                  width={150}
                  height={150}
                />
                <h1 className="text-5xl font-bold text-black mt-4">
                  Introducing Fairplay360
                </h1>
                <p className="text-lg font-bold text-black mt-2">
                  A platform to report and document human rights violations
                </p>
                <SplitText
                  text="AI powered"
                  delay={200}
                  className="text-md font-bold text-black mt-2"
                />
              </div>
              <Particles
                className="absolute inset-0 z-0"
                quantity={300}
                ease={50}
                color="#000000"
              />
            </div>
          </div>

          {/* Sección Inferior (versión desktop) */}
          <div className="col-span-5 row-start-3 flex items-center justify-center">
            <div className="grid grid-cols-3 grid-rows-1 gap-0 w-[80%] max-w-10xl">
              {/* RotatingText */}
              <div className="col-span-2 bg-white border-b border-l border-silver flex items-center justify-center rounded-bl-xl shadow-lg">
                <WarpBackground
                  className="w-full h-full bg-white flex items-center justify-center rounded-bl-xl"
                  beamDuration={20}
                  beamDelayMax={20}
                  beamDelayMin={0}
                  beamsPerSide={10}
                  perspective={10}
                >
                  <div className="bg-white min-w-64 flex justify-center">
                    <RotatingText
                      texts={["Analize", "Report", "Fairplay"]}
                      mainClassName="w-full text-black text-5xl font-bold overflow-hidden py-1 justify-center text-center"
                      staggerFrom="last"
                      initial={{ y: "100%" }}
                      animate={{ y: 0 }}
                      exit={{ y: "-120%" }}
                      staggerDuration={0.025}
                      splitLevelClassName="overflow-hidden pb-1"
                      transition={{ type: "spring", damping: 30, stiffness: 400 }}
                      rotationInterval={2000}
                    />
                  </div>
                </WarpBackground>
              </div>

              {/* Call to Action */}
              <div className="col-start-3 border-x border-b border-silver bg-white flex items-center justify-center rounded-br-xl shadow-lg">
                <div className="w-full h-full bg-white rounded-br-xl flex flex-col p-4">
                  <h1 className="text-md text-gray-600 mb-2">
                    Fairplay360 aims to combat hate speech through AI-driven moderation.
                    We seek to create a safer digital space for fans, players, and organizations.
                  </h1>
                  <p className="text-lg font-bold text-black mt-2">
                    Start now
                  </p>
                  <button
                    onClick={() => (window.location.href = "/report")}
                    className="mt-4"
                  >
                    <AnimatedShinyText
                      className="w-[80%] shadow-s mb-5 border-2 rounded-xl inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300"
                    >
                      <span>📝 Report here</span>
                      <ArrowRightIcon className="ml-1 transition-transform duration-300 ease-in-out" />
                    </AnimatedShinyText>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FadeIn>

      <motion.div
        ref={stepperRef}
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
      <div className='flex-col justify-center items-center m-0 relative'>
        <div className='mt-40 text-center text-7xl'>
          <ScrollFloat
            animationDuration={0.5}
            ease='back.inOut(2)'
            scrollStart='center bottom+=50%'
            scrollEnd='bottom bottom-=40%'
            stagger={0.03}
            textClassName='text-7xl font-bold'
          >
            Steps to follow:
          </ScrollFloat>

        </div>
        <div className="flex justify-center items-center">

          <Stepper
            initialStep={1}
            stepCircleContainerClassName="justify-center items-center rounded-xl mt-20"
            contentClassName="h-full"
            backButtonText="Previous"
            nextButtonText="Next"
            nextButtonProps={{ className: "bg-black rounded-xl text-white w-[30%] sm:w-[10%] h-[80%]" }}
          >
            <Step>
              <h1 className="text-2xl font-semibold">
                Upload the content you want to analyze:
              </h1>
              <ul className="my-2">
                <li>- Upload a picture</li>
                <li>- Upload text</li>
                <li>- Or even an X&apos;s post</li>
              </ul>
            </Step>
            <Step>
              <h1 className="text-2xl font-semibold">
                (Optionally) You can add some context so the result is more accurate
              </h1>
            </Step>
            <Step>
              <h1 className="text-2xl font-semibold">
                Just analyze and wait for the results!
              </h1>
            </Step>
            <Step>
              <h1 className="text-2xl font-semibold">
                You just have made your first report
              </h1>
              <p>Thank you for your help!</p>
            </Step>
          </Stepper>
        </div>



      </div>
    </motion.div>
    </div >
  );
}