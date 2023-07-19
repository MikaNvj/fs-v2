import {atom} from "recoil";

export const copyState = atom({
    key: 'copy',
    default: []
});

export const _copyState = atom({
    key: '_copy',
    default: {}
});