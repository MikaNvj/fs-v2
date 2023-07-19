import {atom} from "recoil";

export const customerState = atom({
    key: 'customer',
    default: []
});

export const _customerState = atom({
    key: '_customer',
    default: {}
})