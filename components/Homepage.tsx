'use client';
import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";



const Homepage = () => {
  return (
    <div>
      <section className="hero grid md:grid-cols-2 lg:px-35 items-center justify-center px-10 md:py-30 py-25 z-10 md:h-max sm:h-[100vh] lg:h-[100vh] gap-y-8 ">
        <div className="text flex flex-col gap-1.5 relative z-50 order-2 md:order-1">
          <h1 className="text-black lg:text-4xl md:text-3xl text-xl font-bold capitalize lg:leading-13 md:leading-10 leading-6.5">
            <span className="text-[var(--color-primary-500)]"> Show </span>
            the world’s <br /> beauty through
            <span className="text-green-300"> your Journal.</span>
          </h1>
          <p className="text-black line-clamp-3 w-[80%] md:text-[14px] text-[12px]">
            Discover amazing places through the eyes of fellow travelers. Share
            your own journeys, explore interactive maps, and get AI-powered
            insights about destinations worldwide.
          </p>
         
        </div>
        <div className="img relative w-full z-50 flex justify-center items-center oreder-1 md:order-2">
          <DotLottieReact
            src="https://lottie.host/e42e646e-8b54-4b7f-8122-7e337680f741/xVJ5tEBGAJ.lottie"
            loop
            autoplay
          />
        </div>
      </section>
    </div>
  );
};

export default Homepage;
