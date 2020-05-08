import React from 'react'
import { FlatList, Text } from 'react-native'
import { useSelector } from 'react-redux'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'

import HeaderButton from '../../components/UI/HeaderButton'

const OrdersScreen = props => {
    // state.orders refers back to the reducer defined in App.js
    // state.orders.orders refers to the orders array in the state in the orders.js reducer
    const orders = useSelector(state => state.orders.orders)

    // keyExtractor is not required here because we have an id field already
return <FlatList data={orders} renderItem={itemData => <Text>{itemData.item.totalAmount}</Text>} />
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

export default OrdersScreen