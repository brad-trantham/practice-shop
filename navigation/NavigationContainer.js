import React, { useEffect, useRef } from 'react'
import {useSelector} from 'react-redux'
import {NavigationActions} from 'react-navigation'

import ShopNavigator from './ShopNavigator'

const NavigationContainer = props => {
    const isAuth = useSelector(state => !!state.auth.token)
    const navRef = useRef()

    useEffect(() => {
        if (!isAuth) {
            // The useRef hook gives us a refernece to the ShopNavigator object,
            // which has access to the navigation routes
            navRef.current.dispatch(NavigationActions.navigate({routeName: 'Auth'}))
        }
    }, [isAuth])

    return <ShopNavigator ref={navRef}/>
}

export default NavigationContainer