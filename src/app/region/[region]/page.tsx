'use client';

import React from "react";
import RegionPackages from "../../components/RegionPackages";

interface PageProps {
  params: {
    region: string;
  };
}

export default function Page({ params }: PageProps) {
  // Decode the region name from URL (replace hyphens with spaces)
  const regionName = params.region.replace(/-/g, ' ');
  
  return <RegionPackages region={regionName} />;
}