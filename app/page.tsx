import React from "react";
import ProductGrid from "./components/ProductGrid";
import { Typography } from "@mui/material";

export default function Home() {
  return (
    <main className="py-4">
      <Typography variant="h3" component="h1" align="center" gutterBottom>
        Webskitters NextJs Coding Assignment
      </Typography>
      <ProductGrid />
    </main>
  );
}
