import {atom, selector} from "recoil";
import { Customer, Obj } from "../../types";

export const customerState = atom<Customer[]>({
    key: 'customer',
    default: []
});

export const _customerState = atom<Obj<Customer>>({
    key: '_customer',
    default: {}
})

export const selectedCustomer = selector({
    key: 'detail-customer-selected',
    get: ({ get }) => ({id}: {id: string}) => {
        const objectArray = get(customerState);
        return objectArray.find(obj => obj.id === id) || null;
      },
    }
)
