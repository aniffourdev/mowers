"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Lato } from "next/font/google";
import { Poppins } from "next/font/google";
import { fetchColors, ColorPalette } from "@/libs/fetchColors";
import ColorInterceptor from "@/libs/ColorInterceptor";
import { FlipWords } from "@/app/ui/flip-words";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Author, author_infos } from "@/api/graphql/content/author";
import Link from "next/link";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

const lato = Lato({ weight: ["100", "300", "400", "700"], subsets: ["latin"] });

const Hero = () => {
  const [author, setAuthor] = useState<Author | null>(null);
  const [colors, setColors] = useState<ColorPalette | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authorData = await author_infos();
        setAuthor(authorData);

        const fetchedColors = await fetchColors();
        setColors(fetchedColors);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <section
        aria-label="Loading hero section"
        className="flex justify-center items-center flex-col mt-20"
      >
        <Skeleton circle={true} width={280} height={280} />
        <Skeleton width={200} height={50} className="mt-4" />
        <Skeleton width={150} height={30} className="mt-2" />
        <Skeleton width={250} height={30} className="mt-2" />
      </section>
    );
  }

  if (!author) {
    return (
      <section
        aria-label="Author not found"
        className={`${lato.className} text-xs space-y-1 flex justify-center items-center my-20 flex-col`}
      >
        <p className="capitalize text-sm">No author found!,</p>
        <Link
          href={`${process.env.NEXT_PUBLIC_ENDPOINT}/wp-admin/profile.php`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold uppercase underline"
          aria-label="Edit author profile"
        >
          Edit Author Here
        </Link>
      </section>
    );
  }

  const colorInterceptor = new ColorInterceptor(colors!);

  return (
    <main>
      <section
        className="flex justify-center items-center flex-col mt-10 md:mt-20"
        aria-label="Author introduction"
      >
        <figure role="img" aria-label={`Profile picture of ${author.name}`}>
          <Image
            src={author.avatar.url}
            alt={`Profile picture of ${author.name}`}
            title={author.name}
            loading="lazy"
            quality={100}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            height={0}
            width={0}
            className="rounded-full h-[200px] w-[200px] md:h-[280px] md:w-[280px] mb-[2.4em] md:mb-0"
          />
        </figure>
        <header className="flex justify-center items-center flex-col">
          <h1 className="-mt-[72px] md:-mt-12">
            <em
              className={`${poppins.className} text-[72px] md:text-[172px] font-bold leading-[0.9] tracking-[-4px] md:tracking-[-12px] drop-shadow-[2px_-2px_0_#fff] md:drop-shadow-[9px_-9px_0_#fff]`}
              style={{ color: colorInterceptor.getColorClass("primary_color") }}
            >
              Hi.
            </em>
          </h1>
          <p
            className={`${poppins.className} font-light text-[22px] md:text-5xl`}
          >
            I am{" "}
            <span style={{ color: colorInterceptor.getColorClass("color_3") }}>
              {author.name}
            </span>
          </p>
          <h2
            className={`${poppins.className} !normal-case !font-light text-[22px] md:!text-5xl !mt-0 md:!mt-3`}
          >
            I am a{" "}
            <span
              className="!font-bold"
              style={{
                color: colorInterceptor.getColorClass("secondary_color"),
              }}
            >
              <FlipWords
                words={["Blogger", "Traveler", "Gardener", "Developer"]}
                className={`text-[${colorInterceptor.getColorClass(
                  "secondary_color"
                )}]`}
                aria-label="Professional roles"
              />{" "}
              <br />
            </span>
          </h2>
        </header>
      </section>
    </main>
  );
};

export default Hero;
