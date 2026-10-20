import { getContent, getFeatured, getGallery } from "@/lib/content/server";
import DayParts from "./_components/home/DayParts";
import Featured from "./_components/home/Featured";
import Gallery from "./_components/home/Gallery";
import Hero from "./_components/home/Hero";
import Marquee from "./_components/home/Marquee";
import Visit from "./_components/home/Visit";

export const revalidate = 300;

export default async function Home() {
  const [settings, hours, featured, gallery] = await Promise.all([
    getContent("settings"),
    getContent("hours"),
    getFeatured(),
    getGallery(),
  ]);

  return (
    <>
      <Hero settings={settings} hours={hours} />
      <Marquee />
      {featured && <Featured item={featured} />}
      <DayParts />
      {gallery.length > 0 && <Gallery photos={gallery} instagram={settings.contact.instagram} />}
      <Visit settings={settings} hours={hours} />
    </>
  );
}
