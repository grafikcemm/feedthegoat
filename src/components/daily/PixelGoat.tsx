import React from "react";
import { cn } from "@/utils/cn";
import type { GoatMood } from "@/lib/goatState";

export function PixelGoat({ className, mood = "AC" }: { className?: string, mood?: GoatMood }) {
  // Coordinate rendering definitions as per spec
  const rects = [
    // Horns
    { x: 14, y: 2, c: "#4A3826" },
    { x: 15, y: 2, c: "#4A3826" },
    { x: 16, y: 2, c: "#4A3826" },
    { x: 14, y: 3, c: "#4A3826" },
    { x: 16, y: 3, c: "#4A3826" },
    { x: 14, y: 4, c: "#4A3826" },
    { x: 16, y: 4, c: "#4A3826" },

    // Head
    { x: 13, y: 4, c: "#E8DDC8" },
    { x: 14, y: 5, c: "#E8DDC8" },
    { x: 15, y: 5, c: "#E8DDC8" },
    { x: 16, y: 5, c: "#E8DDC8" },
    { x: 17, y: 5, c: "#E8DDC8" },
    { x: 12, y: 5, c: "#E8DDC8" },
    { x: 13, y: 5, c: "#E8DDC8" },
    { x: 12, y: 6, c: "#E8DDC8" },
    { x: 13, y: 6, c: "#E8DDC8" },
    { x: 14, y: 6, c: "#E8DDC8" },
    { x: 15, y: 6, c: "#E8DDC8" },
    { x: 16, y: 6, c: "#E8DDC8" },
    { x: 17, y: 6, c: "#E8DDC8" },
    { x: 18, y: 6, c: "#E8DDC8" },
    { x: 12, y: 7, c: "#E8DDC8" },
    { x: 13, y: 7, c: "#E8DDC8" },
    { x: 15, y: 7, c: "#E8DDC8" },
    { x: 16, y: 7, c: "#E8DDC8" },
    { x: 17, y: 7, c: "#E8DDC8" },
    { x: 18, y: 7, c: "#E8DDC8" },
    { x: 13, y: 8, c: "#E8DDC8" },
    { x: 14, y: 8, c: "#E8DDC8" },
    { x: 15, y: 8, c: "#E8DDC8" },
    { x: 16, y: 8, c: "#E8DDC8" },
    { x: 17, y: 8, c: "#E8DDC8" },

    // Eye
    { x: 14, y: 7, c: "#0A0A0C" },

    // Body main
    ...Array.from({ length: 9 }, (_, i) => ({ x: 4 + i, y: 8, c: "#E8DDC8" })),
    ...Array.from({ length: 11 }, (_, i) => ({ x: 3 + i, y: 9, c: "#E8DDC8" })),
    ...Array.from({ length: 10 }, (_, i) => ({ x: 3 + i, y: 10, c: "#E8DDC8" })),
    ...Array.from({ length: 10 }, (_, i) => ({ x: 3 + i, y: 11, c: "#E8DDC8" })),

    // Body shadow over paints:
    { x: 3, y: 11, c: "#B8A988" },
    { x: 4, y: 11, c: "#B8A988" },
    { x: 11, y: 11, c: "#B8A988" },
    { x: 12, y: 11, c: "#B8A988" },

    // Front legs
    { x: 10, y: 12, c: "#E8DDC8" },
    { x: 11, y: 12, c: "#E8DDC8" },
    { x: 10, y: 13, c: "#E8DDC8" },
    { x: 11, y: 13, c: "#E8DDC8" },
    { x: 10, y: 14, c: "#E8DDC8" },
    { x: 11, y: 14, c: "#E8DDC8" },
    { x: 10, y: 15, c: "#E8DDC8" },
    { x: 11, y: 15, c: "#E8DDC8" },

    // Back legs
    { x: 4, y: 12, c: "#E8DDC8" },
    { x: 5, y: 12, c: "#E8DDC8" },
    { x: 4, y: 13, c: "#E8DDC8" },
    { x: 5, y: 13, c: "#E8DDC8" },
    { x: 4, y: 14, c: "#E8DDC8" },
    { x: 5, y: 14, c: "#E8DDC8" },
    { x: 4, y: 15, c: "#E8DDC8" },
    { x: 5, y: 15, c: "#E8DDC8" },

    // Hooves (overwrite bottom leg pixels)
    { x: 4, y: 15, c: "#3A2E1F" },
    { x: 5, y: 15, c: "#3A2E1F" },
    { x: 10, y: 15, c: "#3A2E1F" },
    { x: 11, y: 15, c: "#3A2E1F" },

    // Tail
    { x: 2, y: 9, c: "#E8DDC8" },
    { x: 2, y: 10, c: "#E8DDC8" },
  ];

  const moodClass = {
    AC: "opacity-90",
    TOK: "opacity-100",
    ALFA: "opacity-100 drop-shadow-[0_0_12px_rgba(245,181,68,0.6)] scale-105",
    DURGUN: "opacity-60 saturate-50",
  }[mood];

  return (
    <div className={cn("inline-block", className)}>
      <svg
        viewBox="0 0 24 18"
        width="100%"
        height="200"
        shapeRendering="crispEdges"
        className={cn("w-full h-[200px] transition-all duration-500", moodClass)}
      >
        <g
          className={cn(
            mood === "ALFA" ? "mood-alfa" : mood === "DURGUN" ? "mood-durgun" : "animate-idle-bob"
          )}
          style={{ transformOrigin: "center" }}
        >
          {rects.map((rect, i) => (
            <rect
              key={i}
              x={rect.x}
              y={rect.y}
              width="1"
              height="1"
              fill={rect.c}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
