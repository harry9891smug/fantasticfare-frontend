'use client';

import React from "react";
import ContinentPackages from "../../components/ContinentPackages";

interface PageProps {
  params: {
    continent: string;
  };
}

export default function Page({ params }: PageProps) {
  // Decode the region name from URL (replace hyphens with spaces)
  // const regionName = params.region.replace(/-/g, ' ');
  const regionName = params.continent;
  
  return <ContinentPackages continent={regionName} />;
}