import {atom, selector} from "recoil";
import { PaymentTypes } from "../../types";

export const payementState = atom<PaymentTypes[]>({
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