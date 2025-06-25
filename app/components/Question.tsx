import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

type QuestionProps = {};

const Question = () => {
  const listQnA = [
    {
      question: "How does the interactive map enhance my travel experience?",
      answer:
        "The interactive map lets you explore destinations visually and discover real traveler stories tied to specific locations.",
    },
    {
      question: "Can I contribute my own travel story to the map?",
      answer:
        "Yes, you can share your travel experience and pin it to the map for others to explore.",
    },
    {
      question: "What makes each NFT ticket unique?",
      answer:
        "Each NFT ticket is cryptographically unique, representing a specific travel event or destination, and can be verified or traded.",
    },
    {
      question: "How do I store or use my travel NFT?",
      answer:
        "You can store your travel NFT in a crypto wallet, and use it for access, verification, or sharing your journey with others.",
    },
    {
      question: "How do I join the travel community?",
      answer:
        "You can sign up on our platform, create a profile, and start connecting with other travelers around the world.",
    },
    {
      question: "What kind of content can I share in the community?",
      answer:
        "You can post trip photos, write reviews, share itineraries, or ask and answer travel-related questions.",
    },
  ];

  return (
    <div className="px-20">
      <div className="text border-b  ">
        <h4 className="text-xl font-bold p-2 text-blue-500">
          Frequently Asked Questions
        </h4>
      </div>
      <div className="flex flex-col gap-5 p-10">
        {listQnA.map((list, index) => (
          <div className="text-black cursor-pointer shadow px-3" key={index}>
            <Accordion type="single" collapsible>
              <AccordionItem value={`item-${index}`}>
                <AccordionTrigger>{list.question}</AccordionTrigger>
                <AccordionContent>{list.answer}</AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Question;
