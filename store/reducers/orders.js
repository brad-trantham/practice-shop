import { ADD_ORDER } from "../actions/orders"
import Order from "../../models/order"

const initialState = {
    orders: []
}

export default (state=initialState, action) => {
    switch(action.type){
        case ADD_ORDER:
            const newOrder = new Order(new Date().toString(),
                                       action.orderData.items,
                                       action.orderData.amount,
                                       new Date())

            // prepending the existing state here isn't specifically needed in this case,
            // but it's good general practice so that you don't lose info in more complex states
            // also note that the concat function here returns a new array
            return {
                ...state, orders: state.orders.concat(newOrder)
            }
    }

    return state
}