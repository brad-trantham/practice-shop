import Product from "../../models/product"

export const DELETE_PRODUCT = 'DELETE_PRODUCT'
export const CREATE_PRODUCT = 'CREATE_PRODUCT'
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT'
export const SET_PRODUCTS = 'SET_PRODUCTS'

export const fetchProducts = () => {
    return async (dispatch, getState) => {
        const userId = getState().auth.userId        
        try{
        const response = await fetch('https://rn-complete-guide-ebe67.firebaseio.com/products.json')

        if(!response.ok) {
            throw new Error('Something went wrong!')
        }

        const resData = await response.json()
        const loadedProducts = []

        for (const key in resData) {
            loadedProducts.push(new Product(key, resData[key].ownerId, resData[key].title, 
                resData[key].imageUrl, resData[key].description, resData[key].price))
        }

        dispatch({type: SET_PRODUCTS, products: loadedProducts, 
                  userProducts: loadedProducts.filter(prod => prod.ownerId === userId)})
    } catch(err) {
        throw err
    }
    }
}

export const deleteProduct = productId => {
    return async (dispatch, getState) => {
        const token = getState().auth.token
        const response = await fetch(`https://rn-complete-guide-ebe67.firebaseio.com/products/${productId}.json?auth=${token}`, {
            method: 'DELETE'
        })

        if(!response.ok){
            throw new Error('Something went wrong!')
        }

        dispatch({type: DELETE_PRODUCT, pid: productId})
    }
}

export const createProduct = (title, description, imageUrl, price) => {
    // lecture 199 - it sounds like there's some magic going on here
    //     redux thunk detects the functional syntax and calls and passes
    //     things appropriately
    return async (dispatch, getState) => {        
        const token = getState().auth.token
        const userId = getState().auth.userId
        // 1) any async code can be executed here - see the react course or redux thunk docs
        // 2) despite the name, fetch() can also be used to post data
        // 3) the .json usage here is a firebase specific thing
        const response = await fetch(`https://rn-complete-guide-ebe67.firebaseio.com/products.json?auth=${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({title, description, imageUrl, price, ownerId: userId})
        })

        const resData = await response.json()
        

        dispatch({type: CREATE_PRODUCT, productData: {
            id: resData.name,
            title: title,
            description: description,
            // modern js shorthand for
            // imageUrl: imageUrl
            imageUrl,
            price,
            ownerId: userId
        }})
    }
}

export const updateProduct = (id, title, description, imageUrl) => {
    // redux thunk provides the getState function here to access the redux store
    return async (dispatch, getState) => {
        const token = getState().auth.token
        // in JS back ticks allow you to create a string with dynamic data inserted
        const response = await fetch(`https://rn-complete-guide-ebe67.firebaseio.com/products/${id}.json?auth=${token}`, {
            // PATCH is like PUT but it only updates what you tell it to update (PUT updates the whole object)
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({title, description, imageUrl})
        })

        if(!response.ok){
            throw new Error('Something went wrong!')
        }

        dispatch({type: UPDATE_PRODUCT, 
            pid: id,
            productData: {
            title: title,
            description: description,
            // modern js shorthand for
            // imageUrl: imageUrl
            imageUrl
        }})
    }
    
}
