import React, {useEffect, useState} from 'react'
import { FlatList, View, ActivityIndicator, StyleSheet, Text } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'

import HeaderButton from '../../components/UI/HeaderButton'
import OrderItem from '../../components/shop/OrderItem'
import * as ordersActions from '../../store/actions/orders'
import Colors from '../../constants/Colors'

const OrdersScreen = props => {
    const [isLoading, setIsLoading] = useState(false)
    // state.orders refers back to the reducer defined in App.js
    // state.orders.orders refers to the orders array in the state in the orders.js reducer
    const orders = useSelector(state => state.orders.orders)
    const dispatch = useDispatch()

    useEffect(()=> {
        setIsLoading(true)
        // remember that you can't use async with useEffect() because useEffect()
        // can not return a promise. Elsewhere we solved this with a helper function,
        // here we use .then()
        dispatch(ordersActions.fetchOrders()).then(()=>{
            setIsLoading(false)
        })        
    }, [dispatch])

    if(isLoading){
        return <View style={styles.centered}><ActivityIndicator size="large" color={Colors.primary}/></View>
    }

    if(orders.length === 0){
        return (<View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>No orders found, start creating some!</Text>
        </View>)
    }

    // keyExtractor is not required here because we have an id field already
return <FlatList data={orders} renderItem={itemData => <OrderItem amount={itemData.item.totalAmount} date={itemData.item.readableDate}
                                                                  items={itemData.item.items} />} />
}

OrdersScreen.navigationOptions = navData => {
    return {
        headerTitle: 'Your Orders',
        headerLeft: () => 
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
            <Item title='Menu' iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
                onPress={()=>{
                    navData.navigation.toggleDrawer()
                }}/>
        </HeaderButtons>
    }
}

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default OrdersScreen