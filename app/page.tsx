import React from "react";
import ProductGrid from "./components/ProductGrid";
import { Typography } from "@mui/material";

export default function Home() {
  return (
    <main className="py-4">
      <Typography className="text-2xl lg:text-5xl font-semibold w-full text-center pb-6 px-6 lg:px-12">
        Webskitters NextJs Coding Assignment
      </Typography>
      <ProductGrid />
    </main>
  );
}
