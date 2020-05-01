import React from 'react'
import { FlatList } from 'react-native'
import { useSelector } from 'react-redux'

import ProductItem from '../../components/shop/ProductItem'

const ProductOverviewScreen = props => {
    const products = useSelector(state => state.products.availableProducts)
    // in older versions of react you'd also need to define the keyExtractor for the FlatList
    return <FlatList data={products} renderItem={itemData => 
        <ProductItem image={itemData.item.imageUrl} title={itemData.item.title} price={itemData.item.price} 
                     onViewDetail={()=>{
                         props.navigation.navigate('ProductDetail', {productId: itemData.item.id, 
                                                                     productTitle: itemData.item.title})
                     }} 
                     onAddToCart={()=>{}} />} />
}

ProductOverviewScreen.navigationOptions = {
    headerTitle: 'All Products'
}

export default ProductOverviewScreen