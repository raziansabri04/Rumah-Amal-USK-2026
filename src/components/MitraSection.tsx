"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface Mitra {
  id: string;
  nama: string;
  imageUrl: string;
}

// Fallback sample partners if DB is empty, matching user's reference UI
const DEFAULT_MITRAS: Mitra[] = [
  {
    id: "def-1",
    nama: "Maybank",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Maybank_logo.svg/1024px-Maybank_logo.svg.png",
  },
  {
    id: "def-2",
    nama: "BTN Syariah",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Logo_BTN_Syariah.svg/1024px-Logo_BTN_Syariah.svg.png",
  },
  {
    id: "def-3",
    nama: "Rumah Amal Salman",
    imageUrl: "https://rumahamal.org/wp-content/uploads/2021/04/Logo-Rumah-Amal-Salman.png",
  },
  {
    id: "def-4",
    nama: "Human Initiative",
    imageUrl: "https://human-initiative.org/wp-content/uploads/2021/03/Logo-HI-Tagline-Blue.png",
  },
  {
    id: "def-5",
    nama: "BSI Syariah",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Bank_Syariah_Indonesia.svg/1024px-Bank_Syariah_Indonesia.svg.png",
  },
];

export default function MitraSection() {
  const [mitras, setMitras] = useState<Mitra[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMitras() {
      try {
        const res = await fetch("/api/mitra?limit=50");
        if (res.ok) {
          const data = await res.json();
          if (data.items && data.items.length > 0) {
            setMitras(data.items);
          } else {
            setMitras(DEFAULT_MITRAS);
          }
        } else {
          setMitras(DEFAULT_MITRAS);
        }
      } catch (err) {
        console.error("Error fetching mitras:", err);
        setMitras(DEFAULT_MITRAS);
      } finally {
        setLoading(false);
      }
    }

    fetchMitras();
  }, []);

  const displayList = mitras.length > 0 ? mitras : DEFAULT_MITRAS;
  // Duplicate list multiple times to ensure seamless infinite looping marquee
  const marqueeList = [...displayList, ...displayList, ...displayList, ...displayList];

  return (
    <section id="mitra" className="w-full bg-white py-14 md:py-20 overflow-hidden border-t border-gray-100">
      <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-[20px] sm:text-[22px] md:text-[26px] font-black text-gray-800 tracking-[0.18em] uppercase text-center">
            MITRA RUMAH AMAL USK
          </h2>
          <div className="mt-2.5 w-14 h-[3.5px] bg-[#ffc800] rounded-full" />
        </div>

        {/* Marquee Infinite Horizontal Swipe Container */}
        {loading ? (
          <div className="flex justify-center items-center gap-8 py-6 opacity-50 animate-pulse">
            <div className="w-36 h-12 bg-gray-200 rounded-lg" />
            <div className="w-36 h-12 bg-gray-200 rounded-lg" />
            <div className="w-36 h-12 bg-gray-200 rounded-lg" />
            <div className="w-36 h-12 bg-gray-200 rounded-lg" />
          </div>
        ) : (
          <div className="relative w-full overflow-hidden group">
            {/* Left & Right Subtle Fade Gradients */}
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-white via-white/80 to-transparent z-10" />

            {/* Continuous Marquee Track */}
            <div className="flex w-max animate-marquee items-center gap-10 sm:gap-14 md:gap-20 py-4">
              {marqueeList.map((item, idx) => (
                <div
                  key={`${item.id}-${idx}`}
                  className="flex items-center justify-center min-w-[140px] sm:min-w-[180px] h-16 sm:h-20 px-4 py-2 transition-transform duration-300 hover:scale-110 cursor-pointer"
                  title={item.nama}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.nama}
                    className="max-h-12 sm:max-h-16 max-w-[160px] sm:max-w-[200px] w-auto h-auto object-contain filter drop-shadow-xs"
                    onError={(e) => {
                      // Fallback text if image load fails
                      const target = e.target as HTMLElement;
                      target.style.display = "none";
                      if (target.parentElement) {
                        target.parentElement.innerText = item.nama;
                        target.parentElement.className =
                          "font-bold text-gray-700 text-sm md:text-base border border-gray-200 rounded-lg px-4 py-2 bg-gray-50";
                      }
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
