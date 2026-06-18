import Hero from "../components/Hero";
import PromoBanner from "../components/PromoBanner";
import FeaturedApps from "../components/FeaturedApps";
import { WeAccept, LatestOrders, CustomerReviews, Newsletter } from "../components/HomeSections";

export default function Home() {
  return (
    <>
      <Hero />
      <PromoBanner />
      <FeaturedApps />
      <LatestOrders />
      <CustomerReviews />
      <Newsletter />
      <WeAccept />
    </>
  );
}
