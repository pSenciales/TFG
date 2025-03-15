"use client";
import SplitText from '@/components/bits/SplitText';
import ScrollFloat from '@/components/bits/ScrollFloat';
import { ArrowRightIcon } from '@radix-ui/react-icons';
import { Particles } from '@/components/magicui/particles';
import { AnimatedShinyText } from '@/components/magicui/animated-shiny-text';
import RotatingText from '@/components/bits/RotatingText';
import { WarpBackground } from '@/components/magicui/warp-background';
import Stepper, { Step } from '@/components/bits/Stepper';

export default function Home() {
  return (
    <div className='flex-col justify-center items-center'>
      <div className="grid grid-cols-5 grid-rows-3 gap-0 mt-20 max-h-7xl">
        <div className="col-span-5 row-span-2 flex items-center justify-center">
          <div className="relative flex justify-center items-center w-[80%] max-w-10xl h-[100%] max-h-2xl flex items-center justify-center border border-silver bg-gradient-to-r from-light-gray to-light-blue rounded-t-xl rounded-b-none">
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
              <WarpBackground
                className='w-full h-full max-h-7xl bg-white border-none rounded-bl-xl rounded-t-none rounded-br-none flex items-center justify-center'
                beamDuration={20}
                beamDelayMax={20}
                beamDelayMin={0}
                beamsPerSide={10}
                perspective={10}
              >
                <div className='bg-white border-none rounded-bl-xl rounded-t-none rounded-br-none min-w-64 flex justify-center'>
                  <RotatingText
                    texts={['Analize', 'Report', 'Fairplay']}
                    mainClassName="w-full text-black text-5xl font-bold overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg text-center"
                    staggerFrom={"last"}
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "-120%" }}
                    staggerDuration={0.025}
                    splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                    transition={{ type: "spring", damping: 30, stiffness: 400 }}
                    rotationInterval={2000}
                  />
                </div>


              </WarpBackground>




            </div>
            <div className='col-start-3 border-x border-b border-silver bg-white flex items-center justify-center size-full rounded-br-xl shadow-lg'>
              <div
                className='w-full h-full max-h-7xl bg-white border-none rounded-br-xl rounded-t-none rounded-bl-none'
              >
                <div className="flex flex-col">
                  <h1 className="text-md text-gray m-5"> Fairplay360 aims to combat hate speech through AI-driven moderation. We seek to create a safer digital space for fans, players, and organizations.</h1>
                  <p className="text-lg font-bold text-black mt-2 mx-5">Start now</p>
                  <button onClick={() => window.location.href = '/report'}>
                    <AnimatedShinyText
                      className="w-[80%] shadow-s mb-5 mx-5 border-2 rounded-xl inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400"
                    >
                      <span>📝 Report here</span>
                      <ArrowRightIcon className="ml-1 size-5 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
                    </AnimatedShinyText>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="EJEMPLO" className='flex-col justify-center items-center m-0 relative'>
        <div id="EJEMPLO2" className='mt-20 text-center text-7xl'>
          <ScrollFloat
            animationDuration={0.5}
            ease='back.inOut(2)'
            scrollStart='center bottom+=50%'
            scrollEnd='bottom bottom-=40%'
            stagger={0.03}
          >
            How to report:
          </ScrollFloat>
        </div>
        <div className='flex justify-center items-center'>
          <Stepper
            initialStep={1}
            stepCircleContainerClassName="justify-center items-center space-x-4 max-w-7xl w-full rounded-xl ml[50%]"
            stepContainerClassName=""
            contentClassName="h-full"
            backButtonText="Previous"
            nextButtonText="Next"
            nextButtonProps={{ className: "bg-black rounded-xl text-white w-[25%]" }}
          >
            <Step>
              <h1 className="text-xl">Upload the content you want to analyze:</h1>
              <ul className="mt-2">
                <li>- Upload a picture</li>
                <li>- Upload text</li>
                <li>- Or even an X&apos;s post</li>
              </ul>
            </Step>
            <Step>
              <h1 className="text-xl">(Optionally) You can add some context so the result is more accurate</h1>
            </Step>
            <Step>
              <h1 className="text-xl">Just analyze and wait for the results!</h1>
            </Step>
            <Step>
              <h1 className="text-xl">You just have made your first report</h1>
              <p>Thank you for your help!</p>
            </Step>
          </Stepper>
        </div>
      </div>




    </div>
  );
}