import { Button, Card, CardActions, CardContent, CardHeader, CardMedia, Typography } from '@mui/material'
import axios from 'axios'
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { http } from '../../../http'
import { Product } from '../../../model'

interface ProductDetailPageProps {
  product: Product
}

const ProductDetailPage: NextPage<ProductDetailPageProps> = ({ product }) => {
  return (
    <div>
      <Head>
        <title>{product.name}</title>
      </Head>

      <Typography component="h1" variant="h3" color="textPrimary" gutterBottom>
        Produtos
      </Typography>
      <Card>
        <CardHeader
          title={product.name.toUpperCase()}
          subheader={`R$ ${product.price}`}
        />
        <CardMedia style={{ paddingTop: "56%" }} image={product.image_url} />
        <CardContent>
          <Typography component="p" variant="body2" color="textSecondary" gutterBottom>
            {product.description}
          </Typography>
        </CardContent>
        <CardActions>
          <Link
            href="/products/[slug]/order"
            as={`/products/${product.slug}/order`}
            passHref
          >
            <Button size="small" color="primary" component="a">Comprar</Button>
          </Link>
        </CardActions>
      </Card>
    </div>
  )
}

export default ProductDetailPage

export const getStaticProps: GetStaticProps<ProductDetailPageProps> = async (context) => {
  const { slug } = context.params!;
  try {
    const { data: product } = await http.get(`products/${slug}`);
    return {
      props: {
        product,
      },
      revalidate: 1 * 60 * 2
    };
  } catch (e) {
    if (axios.isAxiosError(e) && e.response?.status === 404) {
      return { notFound: true };
    }
    throw e;
  }
}

export const getStaticPaths: GetStaticPaths = async (context) => {
  const { data: products } = await http.get('products');

  const paths = products.map((p: Product) => ({
    params: { slug: p.slug }
  }));

  return { paths, fallback: 'blocking' };
};