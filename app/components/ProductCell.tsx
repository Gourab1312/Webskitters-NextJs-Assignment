import React from 'react';
import { Product } from '../../types/Product';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';

interface ProductCellProps {
  product: Product | null;
  isVisible: boolean;
}

const ProductCell: React.FC<ProductCellProps> = ({ product, isVisible}) => {
  return (
    <Card
      sx={{
        width: '100%',
        height: 200,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
        backgroundColor: isVisible ? 'white' : 'black',
        color: isVisible ? 'black' : 'white',
      }}
    >
      {isVisible && product ? (
        <>
          <CardMedia
            component="img"
            image={product.image}
            alt={product.title}
            sx={{ maxWidth: '100%', maxHeight: 100, objectFit: 'contain', marginBottom: 1 }}
          />
          <CardContent sx={{ padding: 1 }}>
            <Typography variant="body2" align="center">
              {product.title}
            </Typography>
          </CardContent>
        </>
      ) : (
        <CardContent sx={{ padding: 1 }}>
        </CardContent>
      )}
    </Card>
  );
};

export default ProductCell;
