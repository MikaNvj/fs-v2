import {atom, selector} from "recoil";

export const payementState = atom({
    key: 'payement',
    default: []
});
export const selectedpayment = selector({
    key: 'detail-payment-selected',
    get: ({ get }) => ({id}) => {
        const objectArray = get(payementState);
        return objectArray.find(obj => obj.id === id) || null;
      },
    }
)