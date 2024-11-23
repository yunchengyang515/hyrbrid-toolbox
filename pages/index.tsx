import type { ReactElement } from 'react';
import Layout from '@/components/layout'; // Ensure the path is correct
import type { NextPageWithLayout } from './_app';

const HomePage: NextPageWithLayout = () => {
  return <p>Welcome to the Home Page!</p>;
};

HomePage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default HomePage;