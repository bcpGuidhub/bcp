import { Button, ButtonGroup, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import { filter, includes, orderBy } from 'lodash';
import { useEffect, useState } from 'react';
import { fShortenNumber } from '../../../../utils/formatNumber';
import InquisiteFilterSidebar from './InquisiteFilterSidebar';
// redux
import { useDispatch, useSelector } from '../../../../redux/store';
// ----------------------------------------------------------------------

const InquistLabel = styled(Typography)(({ theme }) => ({
  ...theme.typography.h6,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1)
}));
// ----------------------------------------------------------------------

function applyFilter(products, sortBy, filters) {
  // SORT BY
  if (sortBy === 'featured') {
    products = orderBy(products, ['sold'], ['desc']);
  }
  if (sortBy === 'newest') {
    products = orderBy(products, ['createdAt'], ['desc']);
  }
  if (sortBy === 'priceDesc') {
    products = orderBy(products, ['price'], ['desc']);
  }
  if (sortBy === 'priceAsc') {
    products = orderBy(products, ['price'], ['asc']);
  }
  // FILTER PRODUCTS
  if (filters.gender.length > 0) {
    products = filter(products, (_product) => includes(filters.gender, _product.gender));
  }
  if (filters.category !== 'All') {
    products = filter(products, (_product) => _product.category === filters.category);
  }
  if (filters.colors.length > 0) {
    products = filter(products, (_product) => _product.colors.some((color) => filters.colors.includes(color)));
  }
  if (filters.priceRange) {
    products = filter(products, (_product) => {
      if (filters.priceRange === 'below') {
        return _product.price < 25;
      }
      if (filters.priceRange === 'between') {
        return _product.price >= 25 && _product.price <= 75;
      }
      return _product.price > 75;
    });
  }
  if (filters.rating) {
    products = filter(products, (_product) => {
      const convertRating = (value) => {
        if (value === 'up4Star') return 4;
        if (value === 'up3Star') return 3;
        if (value === 'up2Star') return 2;
        return 1;
      };
      return _product.totalRating > convertRating(filters.rating);
    });
  }
  return products;
}

InquistFilter.propTypes = {
  posts: PropTypes.array
};

export default function InquistFilter({ posts }) {
  const [openFilter, setOpenFilter] = useState(false);
  // const { products, sortBy, filters } = useSelector((state) => state.product);
  // const filteredProducts = applyFilter(products, sortBy, filters);
  const numberPosts = posts?.length;
  // const handleOpenFilter = () => {
  //   setOpenFilter(true);
  // };

  // const handleCloseFilter = () => {
  //   setOpenFilter(false);
  // };
  // const formik = useFormik({
  //   initialValues: {
  //     gender: filters.gender,
  //     category: filters.category,
  //     colors: filters.colors,
  //     priceRange: filters.priceRange,
  //     rating: filters.rating
  //   },
  //   onSubmit: async (values, { setSubmitting }) => {
  //     try {
  //       // await fakeRequest(500);
  //       // setSubmitting(false);
  //     } catch (error) {
  //       console.error(error);
  //       // setSubmitting(false);
  //     }
  //   }
  // });

  // const { values, resetForm, handleSubmit, isSubmitting, initialValues } = formik;

  // const handleResetFilter = () => {
  //   handleSubmit();
  //   resetForm();
  // };

  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2, md: 4 }} justifyContent="space-between">
      <InquistLabel>
        {numberPosts > 1 ? `${fShortenNumber(posts?.length)} questions` : `${fShortenNumber(posts?.length)} question`}
      </InquistLabel>
      {/* <Stack direction="row" spacing={2}>
        <ButtonGroup variant="outlined" aria-label="filter questions">
          <Button>Newest</Button>
          <Button>Active</Button>
          <Button>Unanswered</Button>
          <Button>Sponsored</Button>
        </ButtonGroup>
        <InquisiteFilterSidebar
          formik={formik}
          isOpenFilter={openFilter}
          onResetFilter={handleResetFilter}
          onOpenFilter={handleOpenFilter}
          onCloseFilter={handleCloseFilter}
        />
      </Stack> */}
    </Stack>
  );
}
