import {atom} from "recoil";

export const formationState = atom({
    key: 'formation',
    default: []
});

export const _formationState = atom({
    key: '_formation',
    default: []
})