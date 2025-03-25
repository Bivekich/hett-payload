import CategoryCard from "./CategoryCard";
import Button from "./uiKit/Button";

const categories = [
  {
    id: 1,
    title: "Аккумуляторы",
    iconSrc: "/images/battery_icon.svg",
    href: "/catalog/batteries",
  },
  {
    id: 2,
    title: "Кузовные элементы",
    iconSrc: "/images/body_parts_icon.svg",
    href: "/catalog/body-parts",
  },
  {
    id: 3,
    title: "Автомобильные диски и шины",
    iconSrc: "/images/wheels_tires_icon.svg",
    href: "/catalog/wheels-tires",
  },
  {
    id: 4,
    title: "Запасные части для ходовой части",
    iconSrc: "/images/chassis_parts_icon.svg",
    href: "/catalog/chassis-parts",
  },
  {
    id: 5,
    title: "Автомобильные аксессуары",
    iconSrc: "/images/accessories_icon.svg",
    href: "/catalog/accessories",
  },
];

const CatalogSection = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 md:px-8">
        <h2 className="text-[36px] font-bold roboto-condensed-bold text-black mb-10">
          Каталог Hett Automotive
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              title={category.title}
              iconSrc={category.iconSrc}
              href={category.href}
            />
          ))}
        </div>

        <div className="flex justify-center">
          <Button
            label="Весь каталог Hett Automotive"
            href="/catalog"
            className="inline-block"
          />
        </div>
      </div>
    </section>
  );
};

export default CatalogSection;
