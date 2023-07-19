import {atom, selector} from "recoil";

export const subState = atom({
    key: 'sub',
    default: []
});

export const _subState = atom({
    key: '_sub',
    default: {}
});
export const selectedsub = selector({
    key: 'detail-sub-selected',
    get: ({ get }) => ({id}) => {
        const objectArray = get(subState);
        return objectArray.find(obj => obj.id === id) || null;
      },
    }
)