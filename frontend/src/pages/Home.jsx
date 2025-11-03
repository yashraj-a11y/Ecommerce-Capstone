

import React from 'react'
import Hero from '../components/Layout/Hero'
import GenderCollectionSection from '../components/ Products/GenderCollectionSection'
import NewArrivals from '../components/ Products/NewArrivals'
import ProductDetails from '../components/ Products/ProductDetails'
import ProductsGrid from '../components/ Products/ProductsGrid'
import FeaturedCollections from '../components/ Products/FeaturedCollections'
import FeaturesSection from '../components/ Products/FeaturesSection'

const placeHolderProducts =  [
    {
        _id : 1 ,
        name : 'Product 1' ,
        price : 253 ,
        image : [{url: "https://picsum.photos/500/500?random=48"}]
    },
    {
        _id : 2 ,
        name : 'Product 2' ,
        price : 193 ,
        image : [{url: "https://picsum.photos/500/500?random=47"}]
    } ,
    {
        _id : 3 ,
        name : 'Product 3' ,
        price : 28243 ,
        image : [{url: "https://picsum.photos/500/500?random=46"}]
    } ,
    {
        _id : 4 ,
        name : 'Product 4' ,
        price : 3643 ,
        image : [{url: "https://picsum.photos/500/500?random=45"}]
    } ,
    {
        _id : 5 ,
        name : 'Product 5' ,
        price : 2353 ,
        image : [{url: "https://picsum.photos/500/500?random=49"}]
    },
    {
        _id : 6 ,
        name : 'Product 6' ,
        price : 1193 ,
        image : [{url: "https://picsum.photos/500/500?random=50"}]
    } ,
    {
        _id : 7 ,
        name : 'Product 7' ,
        price : 2283 ,
        image : [{url: "https://picsum.photos/500/500?random=51"}]
    } ,
    {
        _id : 8 ,
        name : 'Product 8' ,
        price : 2363 ,
        image : [{url: "https://picsum.photos/500/500?random=52"}]
    }
  
]

const Home = () => {
  return (
    <div>
        <Hero />
        <GenderCollectionSection />
        <NewArrivals />


        {/* Best sellar section */}
        <h2 className='text-3xl text-center font-bold mb-4'>Best Seller</h2>
        <ProductDetails />

        <div className='container mx-auto'>
            <h2 className='text-3xl text-center font-bold mb-4'>
                Top wears for Women
            </h2>
            <ProductsGrid products={placeHolderProducts} />

        </div>

        <FeaturedCollections />
        <FeaturesSection />
    </div>
  )
}

export default Home