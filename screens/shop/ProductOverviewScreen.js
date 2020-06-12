import React, { useState, useEffect, useCallback } from 'react'
import { View, FlatList, Button, Platform, ActivityIndicator, StyleSheet, Text } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'

import ProductItem from '../../components/shop/ProductItem'
// this merges all exports into one object
import * as cartActions from '../../store/actions/cart'
import * as productActions from '../../store/actions/products'
import HeaderButton from '../../components/UI/HeaderButton'
import Colors from '../../constants/Colors'

const ProductOverviewScreen = props => {
    const [isLoading, setIsLoading] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [error, setError] = useState()
    const products = useSelector(state => state.products.availableProducts)
    const dispatch = useDispatch()

    // useEffect can not return a promise and therefore can not use
    // the async/await keywords
    // this function is used to set up the async function
    // which awaits the load
    const loadProducts = useCallback(async () => {
        setError(null)
        setIsRefreshing(true)
        try {
            await dispatch(productActions.fetchProducts())
        } catch(err) {
            setError(err.message)
        }
        setIsRefreshing(false)
    }, [dispatch, setIsLoading, setError])

    useEffect(() => {
        const willFocusSub = props.navigation.addListener('willFocus', loadProducts)

        // cleanup function that is run with this component is removed or rebuilt
        return () => {
            willFocusSub.remove()
        }
    }, [loadProducts])

    // this runs once when the component is loaded
    useEffect(() => {
        setIsLoading(true)
        loadProducts().then(()=>{
            setIsLoading(false)
        })
    }, [dispatch, loadProducts])

    const selectItemHandler = (id, title) => {
        props.navigation.navigate('ProductDetail', {productId: id, 
            productTitle: title})
    }

    if(error) {
        return <View style={styles.centered}>
                <Text>An error occured!</Text>
                <Button title="Try again" onPress={loadProducts} color={Colors.primary}/>
               </View>
    }

    if (isLoading) {
        return <View style={styles.centered}>
            <ActivityIndicator size="large" color={Colors.primary}/>
        </View>
    }

    if(!isLoading && products.length === 0) {
        return <View style={styles.centered}>
            <Text>No products founds. Maybe start adding some?</Text>
        </View>
    }

    // in older versions of react you'd also need to define the keyExtractor for the FlatList
    return <FlatList onRefresh={loadProducts} refreshing={isRefreshing} 
                data={products} renderItem={itemData => 
        <ProductItem image={itemData.item.imageUrl} title={itemData.item.title} price={itemData.item.price} 
                     onSelect={()=>{
                         selectItemHandler(itemData.item.id, itemData.item.title)
                     }}>
            <Button color={Colors.primary} title="View Details" onPress={()=>{
                         selectItemHandler(itemData.item.id, itemData.item.title)
                     }} />
            <Button color={Colors.primary} title="To Cart" onPress={() => {dispatch(cartActions.addToCart(itemData.item))}} />
        </ProductItem>} />
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

const styles = StyleSheet.create({
    centered: {
        flex: 1, 
        justifyContent: 'center',
        alignItems: 'center'}
})

export default ProductOverviewScreen