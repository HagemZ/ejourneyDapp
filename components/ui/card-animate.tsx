import { DotLottieReact } from "@lottiefiles/dotlottie-react";

interface CardProps {
  animation?: string;
  title?: string;
  description?: string;
}

const CardAnimate: React.FC<CardProps> = ({
  animation = "",
  title = "",
  description = "",
}) => {
  return (
    <div className="cursor-pointer w-[250px] min-w-[250px] bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden transform transition duration-500 hover:-translate-y-2 hover:shadow-2xl">
      <div className="gamber">
        <DotLottieReact src={animation} loop autoplay />
      </div>
      <div className="p-6">
        <h2 className="text-lg font-semibold text-[var(--color-primary-500)] mb-2">
          {title}
        </h2>
        <p className="text-gray-700 mb-4 text-justify text-[14px]">
          {description}
        </p>
      </div>
    </div>
  );
};

export default CardAnimate;