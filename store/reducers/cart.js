import { ADD_TO_CART } from "../actions/cart"
import CartItem from '../../models/cart-item'

const initialState = {
    items: {},
    totalAmount: 0
}

export default (state = initialState, action) => {
    switch(action.type) {
        case ADD_TO_CART:
            const addedProduct = action.product
            const prodPrice = addedProduct.price
            const prodTitle = addedProduct.title

            let updatedOrNewCartItem

            // this checks to see if the key already has an entry, if it already exists
            // (if it is true-ish)
            if(state.items[addedProduct.id]) {
                // already have the item in the cart
                updatedOrNewCartItem = new CartItem(
                    state.items[addedProduct.id].quantity + 1,
                    // both price and title should be the same, regardless of whether
                    // we access the old one or the new one here
                    state.items[addedProduct.id].prodPrice,
                    prodTitle,
                    // sum = current sum + price of adding another one of the item
                    state.items[addedProduct.id].sum + prodPrice
                )
                
            }
            else {
                updatedOrNewCartItem = new CartItem(1, prodPrice, prodTitle, prodPrice)                
            }

            return {
                // we don't really need to copy the existing state here because
                // aftwards we set both our keys, but it would be good practice
                // to do so most of the time in case we add more variables
                // to the state later
                ...state,
                // the [addedProduct.id] usage here establishes a new key
                items: {...state.items, [addedProduct.id]: updatedOrNewCartItem},
                totalAmount: state.totalAmount + prodPrice
            }
    }
    return state
}