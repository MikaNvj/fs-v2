import {atom, selector} from "recoil";
import { Payment } from "../../types";

export const payementState = atom<Payment[]>({
    key: 'payement',
    default: []
});
export const selectedpayment = selector({
    key: 'detail-payment-selected',
    get: ({ get }) => ({id}: {id: string}) => {
        const objectArray = get(payementState);
        return objectArray.find(obj => obj.id === id) || null;
      },
    }
)