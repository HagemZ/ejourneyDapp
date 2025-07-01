import React from 'react'

import Homepage from "@/components/Homepage";
import Service from "@/components/Service";
import TransparencySection from "@/components/TransparencySection";
import Question from "@/components/Question";
import Header from '@/components/Header';


const Page = () => {
  return (
    <div className="overflow-auto bg-[#fafafb]">
      <Header />
      <Homepage />
      <Service />
      <TransparencySection />
      <Question />
    </div>
  );
}



export default Page;