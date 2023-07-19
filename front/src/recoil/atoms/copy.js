import {atom, selector} from "recoil";

export const copyState = atom({
    key: 'copy',
    default: []
});

export const _copyState = atom({
    key: '_copy',
    default: {}
});
export const selectedcopy = selector({
    key: 'detail-copy-selected',
    get: ({ get }) => ({id}) => {
        const objectArray = get(copyState);
        return objectArray.find(obj => obj.id === id) || null;
      },
    }
)