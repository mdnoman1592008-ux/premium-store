import Hero from "../components/Hero";
import PromoBanner from "../components/PromoBanner";
import FeaturedApps from "../components/FeaturedApps";
import {
  WeAccept,
  LatestOrders,
  HowItWorks,
  WhyChooseUs,
  CustomerReviews,
  FAQSection,
  Newsletter,
} from "../components/HomeSections";

export default function Home() {
  return (
    <>
      <Hero />
      <PromoBanner />
      <FeaturedApps />
      <LatestOrders />
      <HowItWorks />
      <WhyChooseUs />
      <CustomerReviews />
      <FAQSection />
      <Newsletter />
      <WeAccept />
    </>
  );
}
