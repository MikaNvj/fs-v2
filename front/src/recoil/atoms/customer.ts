import {atom, selector} from "recoil";
import { CustomerTypes, Obj } from "../../types";

export const customerState = atom<CustomerTypes[]>({
    key: 'customer',
    default: []
});

export const _customerState = atom<Obj<CustomerTypes>>({
    key: '_customer',
    default: {}
})

export const selectedCustomer = selector< CustomerTypes| any>({
    key: 'detail-customer-selected',
    get: ({ get }) => ({id}: {id: string}) => {
        const objectArray = get(customerState);
        return objectArray.find(obj => obj.id === id) || null;
      },
    }
)
