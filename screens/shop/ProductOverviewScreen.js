import React from 'react'
import { FlatList, Platform } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'

import ProductItem from '../../components/shop/ProductItem'
// this merges all exports into one object
import * as cartActions from '../../store/actions/cart'
import HeaderButton from '../../components/UI/HeaderButton'
import { Header } from 'react-navigation-stack'

const ProductOverviewScreen = props => {
    const products = useSelector(state => state.products.availableProducts)
    const dispatch = useDispatch()
    // in older versions of react you'd also need to define the keyExtractor for the FlatList
    return <FlatList data={products} renderItem={itemData => 
        <ProductItem image={itemData.item.imageUrl} title={itemData.item.title} price={itemData.item.price} 
                     onViewDetail={()=>{
                         props.navigation.navigate('ProductDetail', {productId: itemData.item.id, 
                                                                     productTitle: itemData.item.title})
                     }} 
                     onAddToCart={()=>{
                         dispatch(cartActions.addToCart(itemData.item))
                     }} />} />
}

ProductOverviewScreen.navigationOptions = navData => {
    return {
        headerTitle: 'All Products',
        headerLeft: () => 
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
            <Item title='Menu' iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
                onPress={()=>{
                    navData.navigation.toggleDrawer()
                }}/>
        </HeaderButtons>,
        headerRight: () => 
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
            <Item title='Cart' iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
                onPress={()=>{
                    navData.navigation.navigate('Cart')
                }}/>
        </HeaderButtons>
    }
}

export default ProductOverviewScreen