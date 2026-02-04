import Image from "next/image";
import FrontendDeveloperJob from "./carrer";

export default function page() {
  return (
    <main className="w-full ">
      {/* HERO IMAGE SECTION */}
      <section className="relative h-[60vh] w-full mb-6 md:h-[70vh]">
        <Image
          src="/carer.jpg" // replace with your image
          alt="About us hero"
          fill
          priority
          className="object-cover rounded-2xl"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20 rounded-2xl" />

        {/* Title */}
        <div className="absolute bottom-10 left-6 md:left-16">
          <h2 className="text-3xl font-semibold text-white md:text-4xl">
            Work with Us
          </h2>
        </div>
      </section>

      {/* CONTENT SECTION */}

      <FrontendDeveloperJob />
    </main>
  );
}
