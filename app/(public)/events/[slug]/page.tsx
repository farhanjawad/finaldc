import React from 'react';
import EventHero from '../../../components/event/EventHero';
import EventInfoCards from '../../../components/event/EventInfoCards';
import EventDescription from '../../../components/event/EventDescription';
import SpeakerGrid from '../../../components/event/SpeakerGrid';
import EventSchedule from '../../../components/event/EventSchedule';

interface EventPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: EventPageProps) {
  const { slug } = await params;
  return {
    title: `"দ্বীনের পথে, নবীনদের সাথে ২.০" | KU Deeni Community`,
    description: `খুলনা বিশ্ববিদ্যালয়ের ইসলামিক সেমিনার`,
  };
}

export default async function EventDetailPage({ params }: EventPageProps) {
  // Await params in Next.js 15+ dynamic route segments
  await params;

  return (
    <main className="flex flex-col min-h-screen">
      <EventHero />
      <EventInfoCards />
      <EventDescription />
      <SpeakerGrid />
      <EventSchedule />
    </main>
  );
}