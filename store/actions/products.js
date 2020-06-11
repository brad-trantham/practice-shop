import Product from "../../models/product"

export const DELETE_PRODUCT = 'DELETE_PRODUCT'
export const CREATE_PRODUCT = 'CREATE_PRODUCT'
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT'
export const SET_PRODUCTS = 'SET_PRODUCTS'

export const fetchProducts = () => {
    return async dispatch => {        
        try{
        const response = await fetch('https://rn-complete-guide-ebe67.firebaseio.com/products.json')

        if(!response.ok) {
            throw new Error('Something went wrong!')
        }

        const resData = await response.json()
        const loadedProducts = []

        for (const key in resData) {
            loadedProducts.push(new Product(key, 'u1', resData[key].title, 
                resData[key].imageUrl, resData[key].description, resData[key].price))
        }

        dispatch({type: SET_PRODUCTS, products: loadedProducts})
    } catch(err) {
        throw err
    }
    }
}

export const deleteProduct = productId => {
    return {type: DELETE_PRODUCT, pid: productId}
}

export const createProduct = (title, description, imageUrl, price) => {
    // lecture 199 - it sounds like there's some magic going on here
    //     redux thunk detects the functional syntax and calls and passes
    //     things appropriately
    return async dispatch => {        
        // 1) any async code can be executed here - see the react course or redux thunk docs
        // 2) despite the name, fetch() can also be used to post data
        // 3) the .json usage here is a firebase specific thing
        const response = await fetch('https://rn-complete-guide-ebe67.firebaseio.com/products.json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({title, description, imageUrl, price})
        })

        const resData = await response.json()
        console.log(resData)

        dispatch({type: CREATE_PRODUCT, productData: {
            id: resData.name,
            title: title,
            description: description,
            // modern js shorthand for
            // imageUrl: imageUrl
            imageUrl,
            price
        }})
    }
}

export const updateProduct = (id, title, description, imageUrl) => {
    return {type: UPDATE_PRODUCT, 
        pid: id,
        productData: {
        title: title,
        description: description,
        // modern js shorthand for
        // imageUrl: imageUrl
        imageUrl
    }}
}
