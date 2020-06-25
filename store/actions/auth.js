import {AsyncStorage} from 'react-native'

export const AUTHENTICATE = 'AUTHENTICATE'
export const LOGOUT = 'LOGOUT'

export const authenticate = (userId, token) => {
    return {
        type: AUTHENTICATE,
        userId: userId,
        token: token
    }
}

export const signup = (email, password) => {
    return async dispatch => {
        const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCui6n13y3fnGRXZsrrT4gMpxkP3t_HZ3I',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password,
                returnSecureToken: true
            })
        })

        if(!response.ok){
            const errorResData = await response.json()
            const errorId = errorResData.error.message
            let message = "Something went wrong"
            if(errorId === 'EMAIL_EXISTS') {
                message = "An account with this email already exists"
            }
            throw new Error(message)
        }

        const resData = await response.json()

        dispatch(authenticate(resData.localId, resData.idToken))
        const expirationDate = new Date(new Date().getTime() + parseInt(resData.expiresIn)*1000)
        saveDataToStorage(resData.idToken, resData.localId, expirationDate)
    }
}

export const login = (email, password) => {
    return async dispatch => {
        const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCui6n13y3fnGRXZsrrT4gMpxkP3t_HZ3I',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password,
                returnSecureToken: true
            })
        })

        if(!response.ok){
            const errorResData = await response.json()
            const errorId = errorResData.error.message
            let message = "Something went wrong"
            if(errorId === 'EMAIL_NOT_FOUND') {
                message = "This email could not be found"
            }
            if(errorId === 'INVALID_PASSWORD') {
                message = "This password is not valid"
            }
            throw new Error(message)
        }

        const resData = await response.json()

        dispatch(authenticate(resData.localId, resData.idToken))
        const expirationDate = new Date(new Date().getTime() + parseInt(resData.expiresIn)*1000)
        saveDataToStorage(resData.idToken, resData.localId, expirationDate)
    }
}

export const logout = () => {
    return { type: LOGOUT }
}

const saveDataToStorage = (token, userId, expirationDate) => {
    AsyncStorage.setItem('userData', JSON.stringify({
        token: token, userId: userId, expiryDate: expirationDate.toISOString()
    }))
}