import HeroBanner from '../components/home/HeroBanner';
import AboutSection from '../components/home/AboutSection';
import PastEventsGrid from '../components/home/PastEventsGrid';
import FeaturedEventBanner from '../components/home/FeaturedEventBanner';

export const metadata = {
  title: 'Khulna University Deeni Community ',
  description: 'খুলনা বিশ্ববিদ্যালয় দ্বীনি কমিউনিটি।',
};

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen">
      <HeroBanner />
      <AboutSection />
      <PastEventsGrid />
      <FeaturedEventBanner />
    </main>
  );
}