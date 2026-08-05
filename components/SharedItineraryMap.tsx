"use client";

import dynamic from "next/dynamic";

const RoteiroMap = dynamic(() => import("@/components/RoteiroMap"), {
  ssr: false,
});

export default function SharedItineraryMap({
  points,
}: {
  points: { id: string; name: string; order: number; lat: number; lng: number }[];
}) {
  return <RoteiroMap points={points} />;
}
