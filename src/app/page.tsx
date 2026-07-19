import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import TechFeatures from "@/components/TechFeatures";
import GalleryPreview from "@/components/GalleryPreview";
import StudioCTA from "@/components/StudioCTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedProducts />
      <TechFeatures />
      <GalleryPreview />
      <StudioCTA />
    </>
  );
}
