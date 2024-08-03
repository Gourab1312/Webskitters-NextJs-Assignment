"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { Product } from "../../types/Product";
import ProductCell from "./ProductCell";
import { Grid, Box, Typography } from "@mui/material";

const ProductGrid: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [visibleCells, setVisibleCells] = useState<boolean[]>(
    Array(20).fill(false)
  );
  const [focusedCell, setFocusedCell] = useState<number | null>(null);
  const cellRefs = useRef<(HTMLDivElement | null)[]>([]);

//   fetching the data when the page is mounted
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get<Product[]>(
          "https://fakestoreapi.com/products"
        );
        setProducts(response.data.slice(0, 20));
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

//   based on clicks of the individual elements we are updating which one should remain black and which should disclose the product and the name
  const handleCellClick = (index: number) => {
    setVisibleCells((prev) => {
      const newVisibleCells = [...prev];
      newVisibleCells[index] = true;
      return newVisibleCells;
    });
    setFocusedCell(index);
  };

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      event.preventDefault();
      if (focusedCell === null) return;

      let newFocusedCell = focusedCell;
      const row = Math.floor(focusedCell / 5);
      const col = focusedCell % 5;

      switch (event.key) {
        case "ArrowUp":
          if (row > 0) setFocusedCell((newFocusedCell -= 5));
          break;
        case "ArrowDown":
          if (row < 3) setFocusedCell((newFocusedCell += 5));
          break;
        case "ArrowLeft":
          if (col > 0) setFocusedCell((newFocusedCell -= 1));
          break;
        case "ArrowRight":
          if (col < 4) setFocusedCell((newFocusedCell += 1));
          break;
      }

      setFocusedCell(newFocusedCell);
    },
    [focusedCell]
  );

//   adding a kewdown eventlistener and removing it when the component unmounts, so that we can manipulate which of the elements can be the focused element
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

//   using useref to get the dom access of the elements and focus the one whose index is matching
  useEffect(() => {
    if (focusedCell !== null) {
      cellRefs.current[focusedCell]?.focus();
    }
  }, [focusedCell]);

//   transferring the data after making the index a string using the dataTransfer method with setting the data in plain text mode
  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("text/plain", index.toString());
  };

//   preventing the default behaviour of selecting texts when the dragging happeens
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

//   getting the index of the target element and interchanging the content of both and using set products to set the new product array that will reflect the exchange in the dom
  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const sourceIndex = parseInt(e.dataTransfer.getData("text/plain"));
    if (sourceIndex !== targetIndex) {
      const newProducts = [...products];
      [newProducts[sourceIndex], newProducts[targetIndex]] = [
        newProducts[targetIndex],
        newProducts[sourceIndex],
      ];
      setProducts(newProducts);
    }
  };

  return (
    <Box
      className="w-full flex items-center justify-center"
      sx={{ flexGrow: 1, padding: 2 }}
    >
      {products.length > 0 ? (
        <Grid
          className="w-full max-w-[1440px] px-6 lg:px-12"
          spacing={2}
          container
        >
          {products.map((product, index) => (
            <Grid item xs={12} sm={6} md={4} lg={2.4} key={product.id}>
              <div
                ref={(el: HTMLDivElement | null) => {
                  cellRefs.current[index] = el;
                }}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                onClick={() => handleCellClick(index)}
                tabIndex={0}
                className={`
                  w-full rounded relative cursor-pointer
                  ${
                    focusedCell === index
                      ? "outline outline-2 outline-gray-500"
                      : ""
                  }
                  focus:outline focus:outline-2 focus:outline-yellow-500
                `}
              >
                <ProductCell
                  product={product}
                  isVisible={visibleCells[index]}
                />
              </div>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography>Loading...</Typography>
      )}
    </Box>
  );
};

export default ProductGrid;
