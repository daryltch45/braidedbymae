import Hero from "@/components/sections/Hero";
import ServiceReveal from "@/components/sections/ServiceReveal";
import Reviews from "@/components/sections/Reviews";
import ContactCTA from "@/components/sections/ContactCTA";

const services = [
  {
    key: "boxBraids",
    image: "/images/portfolio/box-braids/IMG_4089.JPG",
    reverse: false,
    accent: "var(--color-primary)",
  },
  {
    key: "cornrows",
    image: "/images/portfolio/twists/IMG_4094.JPG",
    reverse: true,
    accent: "var(--color-accent)",
  },
  {
    key: "twists",
    image: "/images/portfolio/twists/IMG_4093.JPG",
    reverse: false,
    accent: "var(--color-primary)",
  },
  {
    key: "locs",
    image: "/images/portfolio/box-braids/IMG_4090.JPG",
    reverse: true,
    accent: "var(--color-accent)",
  },
  {
    key: "crochet",
    image: "/images/portfolio/crochet/IMG_4091.JPG",
    reverse: false,
    accent: "var(--color-primary)",
  },
  {
    key: "men",
    image: "/images/portfolio/crochet/IMG_4092.JPG",
    reverse: true,
    accent: "var(--color-accent)",
  },
];

export default function HomePage() {
  return (
    <main>
      <Hero />
      <div id="services">
        {services.map((service) => (
          <ServiceReveal
            key={service.key}
            serviceKey={service.key}
            imageSrc={service.image}
            reverse={service.reverse}
            accentColor={service.accent}
          />
        ))}
      </div>
      <Reviews />
      <ContactCTA />
    </main>
  );
}
