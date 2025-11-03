import React, { useState, useRef, useCallback } from "react";
import variant1 from "../assets/variant_1.png";
import variant2 from "../assets/variant_2.png";
import variant3 from "../assets/variant_3.png";
import variant4 from "../assets/variant_4.png";
import variant5 from "../assets/variant_5.png";

const variantData = [
  { id: 1, url: variant1 },
  { id: 2, url: variant2 },
  { id: 3, url: variant3 },
  { id: 4, url: variant4 },
  { id: 5, url: variant5 },
];

const getTransformStyles = (relativeIndex, dragX, isDragging) => {
  const isCenter = relativeIndex === 0;
  const isPrev = relativeIndex === -1;
  const isNext = relativeIndex === 1;

  let translateX, rotateY, scale, opacity, zIndex, filter;

  if (isCenter) {
    translateX = dragX / 5;
    rotateY = dragX / 30;
    scale = 1;
    opacity = 1;
    zIndex = 10;
    filter = "drop-shadow(0 0 30px rgba(0,0,0,0.3))";
  } else if (isPrev) {
    translateX = -180;
    rotateY = 35;
    scale = 0.8;
    opacity = 0.6;
    zIndex = 5;
  } else if (isNext) {
    translateX = 180;
    rotateY = -35;
    scale = 0.8;
    opacity = 0.6;
    zIndex = 5;
  } else if (relativeIndex < -1) {
    translateX = -400;
    rotateY = 60;
    scale = 0.5;
    opacity = 0;
    zIndex = 1;
  } else {
    translateX = 400;
    rotateY = -60;
    scale = 0.5;
    opacity = 0;
    zIndex = 1;
  }

  if (!isCenter && isDragging) {
    if (isPrev) translateX += dragX * 0.5;
    if (isNext) translateX += dragX * 0.5;
  }

  return {
    transform: `translateX(${translateX}px) rotateY(${rotateY}deg) scale(${scale})`,
    opacity,
    zIndex,
    filter,
  };
};

export default function Variants() {
  const [index, setIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const variants = variantData;
  const numVariants = variants.length;

  const prev = useCallback(
    () => setIndex((i) => (i - 1 + numVariants) % numVariants),
    [numVariants]
  );
  const next = useCallback(
    () => setIndex((i) => (i + 1) % numVariants),
    [numVariants]
  );

  const handleStart = (clientX) => {
    setIsDragging(true);
    startX.current = clientX;
  };
  const handleMove = (clientX) => {
    if (!isDragging) return;
    const delta = clientX - startX.current;
    const limited = Math.max(Math.min(delta, 250), -250);
    setDragX(limited);
  };
  const handleEnd = () => {
    setIsDragging(false);
    if (dragX > 80) prev();
    else if (dragX < -80) next();
    setDragX(0);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full font-sans p-4 select-none">
      {/* Carousel */}
      <div className="relative flex items-center justify-center w-full max-w-lg h-[300px] md:h-[350px]">
        <button
          onClick={prev}
          className="absolute left-0 lg:-left-16 text-gray-700 text-5xl p-2 rounded-full hover:text-yellow-500 transition z-20 focus:outline-none active:scale-95"
        >
          &#x276E;
        </button>

        <div
          className="relative w-full h-full flex justify-center items-center"
          style={{ perspective: "1000px" }}
          onMouseDown={(e) => handleStart(e.clientX)}
          onMouseMove={(e) => handleMove(e.clientX)}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          // --- PERBAIKAN: Mencegah default behavior untuk touch events (scrolling halaman) ---
          onTouchStart={(e) => {
            e.preventDefault(); // Blokir scroll halaman saat mulai swipe
            handleStart(e.touches[0].clientX);
          }}
          onTouchMove={(e) => {
            e.preventDefault(); // Blokir scroll halaman saat proses swipe
            handleMove(e.touches[0].clientX);
          }}
          onTouchEnd={handleEnd}
        >
          {variants.map((variant, i) => {
            let relativeIndex = i - index;
            if (relativeIndex > numVariants / 2) relativeIndex -= numVariants;
            else if (relativeIndex < -numVariants / 2)
              relativeIndex += numVariants;

            const styles = getTransformStyles(relativeIndex, dragX, isDragging);
            const isCenter = relativeIndex === 0;
            const isVisible = relativeIndex >= -2 && relativeIndex <= 2;

            return (
              <img
                key={variant.id}
                src={variant.url}
                alt={`Varian ${variant.id}`}
                draggable={false}
                className={`absolute w-[180px] h-[220px] md:w-[200px] md:h-[250px] object-cover rounded-lg shadow-lg transition-all ${
                  isDragging ? "duration-100 ease-out" : "duration-500 ease-out"
                }`}
                style={{
                  ...styles,
                  visibility: isVisible ? "visible" : "hidden",
                  cursor: isCenter ? "default" : "pointer",
                  transition: isDragging
                    ? "none"
                    : "transform 500ms ease-out, opacity 500ms ease-out",
                }}
                onClick={() => {
                  if (relativeIndex === -1) prev();
                  if (relativeIndex === 1) next();
                }}
              />
            );
          })}
        </div>

        <button
          onClick={next}
          className="absolute right-0 lg:-right-16 text-gray-700 text-5xl p-2 rounded-full hover:text-yellow-500 transition z-20 focus:outline-none active:scale-95"
        >
          &#x276F;
        </button>
      </div>

      {/* Teks di luar container carousel */}
      <div className="mt-[-60px] text-center">
        <h1 className="text-2xl md:text-2xl font-extrabold text-white tracking-widest uppercase">
          Banyak Varian SN Essence
        </h1>
      </div>

      {/* Indikator */}
      <div className="flex space-x-2 mt-6">
        {variants.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-colors duration-300 cursor-pointer ${
              i === index
                ? "bg-yellow-500 scale-125"
                : "bg-gray-400 hover:bg-gray-500"
            }`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>

      <div className="mt-4 text-sm text-gray-500 text-center">
        Geser atau klik gambar untuk mengganti varian.
      </div>
    </div>
  );
}