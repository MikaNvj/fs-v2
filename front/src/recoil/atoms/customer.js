import {atom, selector} from "recoil";

export const customerState = atom({
    key: 'customer',
    default: []
});

export const _customerState = atom({
    key: '_customer',
    default: {}
})

export const selectedCustomer = selector({
    key: 'detail-customer-selected',
    get: ({ get }) => ({id}) => {
        const objectArray = get(customerState);
        return objectArray.find(obj => obj.id === id) || null;
      },
    }
)
