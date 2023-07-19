import {atom} from "recoil";

export const subState = atom({
    key: 'sub',
    default: []
});

export const _subState = atom({
    key: '_sub',
    default: {}
});