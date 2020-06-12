import React, {useReducer, useCallback} from 'react'
import {ScrollView, View, KeyboardAvoidingView, StyleSheet, Button} from 'react-native'
import {LinearGradient} from 'expo-linear-gradient'
import {useDispatch} from 'react-redux'

import Input from '../../components/UI/Input'
import Card from '../../components/UI/Card'
import Colors from '../../constants/Colors'
import * as authActions from '../../store/actions/auth'

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

const AuthScreen = props => {
    const dispatch = useDispatch()

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            email: '',
            password: ''
        }, 
        inputValidities: {
            email: false,
            password: false
        },
        formIsValid: false
    })

    const signupHandler = () => {
        dispatch(authActions.signup(formState.inputValues.email, formState.inputValues.password))
    }

    const inputChangeHandler = useCallback((inputIdentifier, inputValue, inputValidity) => {
        dispatchFormState({type: FORM_INPUT_UPDATE, value: inputValue, isValid: inputValidity, input: inputIdentifier})
    },[dispatchFormState])

    return( 
    <KeyboardAvoidingView keyboardVerticalOffset={500} style={styles.screen}>
        <LinearGradient style={styles.gradient} colors={['#ffedff', '#ffe3ff']}>
            <Card style={styles.authContainer}>
                <ScrollView>
                    <Input id="email" label="Email" keyboardType="email-address" required email autoCaptitalize="none" 
                        errorText="Please enter a valid email address." onInputChange={inputChangeHandler} initialValue=""/>
                    <Input id="password" label="Password" keyboardType="default" secureTextEntry required minLength={5} autoCaptitalize="none" 
                        errorText="Please enter a valid password." onInputChange={inputChangeHandler} initialValue=""/>
                    <View style={styles.buttonContainer}><Button title="Login" color={Colors.primary} onPress={signupHandler}/></View>
                    <View style={styles.buttonContainer}><Button title="Sign Up" color={Colors.accent} onPress={()=>{}}/></View>
                </ScrollView>
            </Card>
        </LinearGradient>
    </KeyboardAvoidingView>
    )}

AuthScreen.navigationOptions = {
    headerTitle: 'Login'
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    authContainer: {
        width: '80%',
        maxWidth: 400,
        maxHeight: 400,
        padding: 20
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonContainer: {
        marginTop: 10
    }
})

export default AuthScreen