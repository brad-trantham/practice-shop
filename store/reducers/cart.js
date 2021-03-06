import { ADD_TO_CART, REMOVE_FROM_CART } from "../actions/cart"
import CartItem from '../../models/cart-item'
import { ADD_ORDER } from "../actions/orders"
import { DELETE_PRODUCT } from "../actions/products"

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
            const pushToken = addedProduct.pushToken

            let updatedOrNewCartItem

            // this checks to see if the key already has an entry, if it already exists
            // (if it is true-ish)
            if(state.items[addedProduct.id]) {
                // already have the item in the cart
                updatedOrNewCartItem = new CartItem(
                    state.items[addedProduct.id].quantity + 1,
                    // both price and title should be the same, regardless of whether
                    // we access the old one or the new one here
                    prodPrice,
                    prodTitle,
                    pushToken,
                    // sum = current sum + price of adding another one of the item
                    state.items[addedProduct.id].sum + prodPrice
                )
                
            }
            else {
                updatedOrNewCartItem = new CartItem(1, prodPrice, prodTitle, pushToken, prodPrice)                
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

        case REMOVE_FROM_CART:
            const selectedCartItem = state.items[action.pid]
            // we're either removing the item entirely or reducing the quantity by 1,
            // depending on whether or not there's more than 1 in the cart
            const currentQty = selectedCartItem.quantity
            let updatedCartItems

            // reduce quantity by 1
            if (currentQty > 1) {
                const updatedCartItem = new CartItem(selectedCartItem.quantity-1, selectedCartItem.productPrice, 
                    selectedCartItem.productTitle, selectedCartItem.sum - selectedCartItem.productPrice)
                updatedCartItems = {...state.items, [action.pid]: updatedCartItem}
            }
            // remove entirely
            else {
                updatedCartItems = {...state.items}
                // delete is a javascript keyword
                delete updatedCartItems[action.pid]
            }

            const newState =  { ...state,
                     items: updatedCartItems,
                     totalAmount: state.totalAmount - selectedCartItem.productPrice}
            return newState
        
        case ADD_ORDER:
            return initialState

        case DELETE_PRODUCT:
            // just return the existing state if the deleted product wasn't in our items
            if(!state.items[action.pid]) {
                return state
            }
            const updatedItems = {...state.items}
            const itemTotal = state.items[action.pid].sum
            delete updatedItems[action.pid]
            return {...state,
                    items: updatedItems,
                    totalAmount: state.totalAmount - itemTotal
                }
    }
    return state
}