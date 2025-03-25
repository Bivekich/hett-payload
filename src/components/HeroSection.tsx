import Image from "next/image";
import Button from "./uiKit/Button";

interface SlideData {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  backgroundImage: string;
}

const slides: SlideData[] = [
  {
    id: "slide1",
    number: "01",
    title: "Качество и надежность",
    subtitle: "Современные технологии и новое производство",
    backgroundImage: "/images/car_repair_bg.jpg",
  },
  {
    id: "slide2",
    number: "02",
    title: "Настоящие эксперты",
    subtitle: "Инновации и развитие",
    backgroundImage: "/images/car_parts_bg.jpg",
  },
  {
    id: "slide3",
    number: "03",
    title: "Инновации и развитие",
    subtitle: "Современные технологии и новое производство",
    backgroundImage: "/images/innovation_bg.jpg",
  },
];

const HeroSection = () => {
  return (
    <section className="relative w-full h-[450px] md:h-[600px]">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className="absolute inset-0 flex items-end"
          style={{
            zIndex: slides.length - index,
            left: `${index * 20}px`,
            width: `calc(100% - ${index * 20}px)`,
            opacity: index === 0 ? 1 : 0.8,
            display: index > 2 ? "none" : "flex",
          }}
        >
          <div className="relative w-full h-full">
            {/* Background image with overlay */}
            <div className="absolute inset-0">
              <Image
                src={slide.backgroundImage}
                alt={slide.title}
                fill
                className="object-cover"
                priority={index === 0}
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 p-8 md:p-16 w-full md:w-2/3 z-10">
              <p className="text-[24px] md:text-[30px] font-bold roboto-condensed-bold text-[#D9D9D9] mb-2">
                {slide.number}
              </p>
              <h2 className="text-[20px] md:text-[24px] font-bold roboto-condensed-bold text-[#D9D9D9] mb-4">
                {slide.title}
              </h2>
              <p className="text-[24px] md:text-[36px] font-bold roboto-condensed-bold text-white mb-8 max-w-2xl">
                {slide.subtitle}
              </p>
              <Button
                label="Подробнее"
                href="/about"
                className="inline-block"
              />
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default HeroSection;
