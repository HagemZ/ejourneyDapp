import Card from "./ui/Card";

import { MapPin, Globe, Users, Star } from "lucide-react";
import { ReactNode } from "react";

interface service {
  judul: string;
  desk: string;
  animation: string;
}

const Service: React.FC = () => {
  const listPilihan = [
    {
      judul: " Interactive Maps",
      desk: "  Explore the world through an interactive map with real travel experiences",
      animation:
        "https://lottie.host/57e99a7f-07e0-48a4-b2e7-e715f199c2ef/XnWWq8fKYK.lottie",
    },
    {
      judul: "Get Your NFT",
      desk: "Setiap tiket perjalanan berupa NFT yang unik, dapat diverifikasi dan ditransfer dengan mudah.",
      animation:
        "https://lottie.host/5f1b362b-f225-4d30-a242-66f614bcb2c8/S4fZHM5z8i.lottie",
    },
    {
      judul: "Travel Community",
      desk: "Connect with travelers and share authentic experiences from around the globe",
      animation:
        "https://lottie.host/792b4f35-27d9-4edb-b2a4-68120023137b/lJsCCVanW8.lottie",
    },

    {
      judul: "AI Insights",
      desk: "  Get smart summaries and insights about destinations based on traveler reviews",
      animation:
        "https://lottie.host/74b096eb-b915-47ed-9c28-ca1f1416d97a/rgQW0YasKV.lottie",
    },
  ];

  return (
    <div className="md:px-20 px-5  mb-10">
      <div className="text border-b  ">
        <h4 className="text-xl font-bold p-2 text-blue-500">
          Advantages of our Website
        </h4>
      </div>
      <div className="pilihan flex overflow-x-scroll gap-5  py-10 pt-2  justify-evenly mt-10">
        {listPilihan.map((list, index) => (
          <Card
            key={index}
            title={list.judul}
            animation={list.animation}
            description={list.desk}
          />
        ))}
      </div>
    </div>
  );
};
export default Service;
