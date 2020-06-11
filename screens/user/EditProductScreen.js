import React, {useEffect, useCallback, useReducer} from 'react'
import { View, ScrollView, KeyboardAvoidingView, StyleSheet, Platform, Alert } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'

import HeaderButton from '../../components/UI/HeaderButton'
import * as productActions from '../../store/actions/products'
import Input from '../../components/UI/Input'

const FORM_INPUT_UPDATE = 'UPDATE'

const formReducer = (state, action) => {
    if(action.type === FORM_INPUT_UPDATE) {
        const updatedValues = {
            ...state.inputValues,
            [action.input]: action.value
        }

        const updatedValidities = {
            ...state.inputValidities,
            [action.input]: action.isValid
        }

        let updatedFormIsValid = true
        for(const key in updatedValidities) {
            updatedFormIsValid = updatedFormIsValid && updatedValidities[key]
        }

        return {formIsValid: updatedFormIsValid, 
                inputValues: updatedValues, 
                inputValidities: updatedValidities}
    }
    return state
}

const EditProductScreen = props => {
    const prodId = props.navigation.getParam('productId')
    const editedProduct = useSelector(state => state.products.userProducts.find(prod => prod.id === prodId))
    const dispatch = useDispatch()

const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            title: editedProduct ? editedProduct.title : '',
            imageUrl: editedProduct ? editedProduct.imageUrl : '',
            description: editedProduct ? editedProduct.description : '',
            price: ''
        }, 
        inputValidities: {
            title: editedProduct ? true : false,
            imageUrl: editedProduct ? true : false,
            description: editedProduct ? true : false,
            price: editedProduct ? true : false,
        },
        formIsValid: editedProduct ? true : false
    })

    const submitHandler = useCallback(() => {
        if(!formState.formIsValid) {
            Alert.alert('Wrong input!', 'Please check the errors in the form', [{text: 'Okay'}])
            return
        }
        if(editedProduct){
            dispatch(productActions.updateProduct(prodId, formState.inputValues.title, formState.inputValues.description, formState.inputValues.imageUrl))
        }
        else {
            // the + converts the price from a string to a number
            dispatch(productActions.createProduct(formState.inputValues.title, formState.inputValues.description, formState.inputValues.imageUrl, +formState.inputValues.price))
        }
        props.navigation.goBack()
    }, [dispatch, prodId, formState])

    useEffect(() => {
        props.navigation.setParams({submit: submitHandler})
    }, [submitHandler])

    // useCallback prevents the function from being rebuilt unncessarily
    const inputChangeHandler = useCallback((inputIdentifier, inputValue, inputValidity) => {
        dispatchFormState({type: FORM_INPUT_UPDATE, value: inputValue, isValid: inputValidity, input: inputIdentifier})
    },[dispatchFormState])

    return (
        // the keyboard avoiding view must use flex 1 or else it doesn't give itself enough space
    <KeyboardAvoidingView style={{flex: 1}} keyboardVerticalOffset={500}>
        <ScrollView>
            <View style={styles.form}>
                <Input id='title' label='Title' errorText='Please enter a valid title' keyboardType='default' autoCapitalize='sentences' autoCorrect returnKeyType='next'
                        onInputChange={inputChangeHandler} initialValue={editedProduct ? editedProduct.title : ''} initiallyValid={!!editedProduct}
                        required />
                <Input id='imageUrl' label='ImageUrl' errorText='Please enter a image URL' keyboardType='default' returnKeyType='next'
                    onInputChange={inputChangeHandler} initialValue={editedProduct ? editedProduct.imageUrl : ''} initiallyValid={!!editedProduct} required/>
                {
                // only allow price editing in add mode
                editedProduct ? null : 
                <Input id='price' label='Price' errorText='Please enter a valid price' onInputChange={inputChangeHandler} keyboardType='decimal-pad' returnKeyType='next' required min={0.1}/>
                }
                <Input id='description' label='Description' errorText='Please enter a valid description' keyboardType='default' autoCapitalize='sentences' autoCorrect multiline numberOfLines={3}
                    onInputChange={inputChangeHandler} initialValue={editedProduct ? editedProduct.description : ''} initiallyValid={!!editedProduct} required minLength={5}/>
            </View>
        </ScrollView>
    </KeyboardAvoidingView>
    )
}

EditProductScreen.navigationOptions = navData => {
    const submitFn = navData.navigation.getParam('submit')
    return {
        headerTitle: navData.navigation.getParam('productId') ? 'Edit Product' : 'Add Product',
        headerRight: () => 
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item title='Save' iconName={Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark'}
            onPress={submitFn}/>
    </HeaderButtons>
    }
}

const styles = StyleSheet.create({
    form: {
        margin: 20, 
    },
    
})

export default EditProductScreen