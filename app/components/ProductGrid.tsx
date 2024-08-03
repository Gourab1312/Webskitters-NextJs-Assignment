'use client';

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Product } from '../../types/Product';
import ProductCell from './ProductCell';
import { Grid, Box } from '@mui/material';

const ProductGrid: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [visibleCells, setVisibleCells] = useState<boolean[]>(Array(20).fill(false));
  const [focusedCell, setFocusedCell] = useState<number | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get<Product[]>('https://fakestoreapi.com/products');
        setProducts(response.data.slice(0, 20));
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  const handleCellClick = (index: number) => {
    setVisibleCells((prev) => {
      const newVisibleCells = [...prev];
      newVisibleCells[index] = true;
      return newVisibleCells;
    });
    setFocusedCell(index);
  };

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (focusedCell === null) return;

    const row = Math.floor(focusedCell / 5);
    const col = focusedCell % 5;

    switch (event.key) {
      case 'ArrowUp':
        if (row > 0) setFocusedCell(focusedCell - 5);
        break;
      case 'ArrowDown':
        if (row < 3) setFocusedCell(focusedCell + 5);
        break;
      case 'ArrowLeft':
        if (col > 0) setFocusedCell(focusedCell - 1);
        break;
      case 'ArrowRight':
        if (col < 4) setFocusedCell(focusedCell + 1);
        break;
    }
  }, [focusedCell]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const sourceIndex = parseInt(e.dataTransfer.getData('text/plain'));
    if (sourceIndex !== targetIndex) {
      const newProducts = [...products];
      [newProducts[sourceIndex], newProducts[targetIndex]] = [newProducts[targetIndex], newProducts[sourceIndex]];
      setProducts(newProducts);
    }
  };

  return (
    <Box sx={{ flexGrow: 1, padding: 2 }}>
      <Grid container spacing={2}>
        {products.map((product, index) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={2.4}
            key={product.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
          >
            <ProductCell
              product={product}
              isVisible={visibleCells[index]}
              onClick={() => handleCellClick(index)}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProductGrid;
