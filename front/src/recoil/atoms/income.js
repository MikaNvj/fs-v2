import {atom, selector} from "recoil";

export const icomeState = atom({
    key: 'icome',
    default: []
});
export const selectedicome = selector({
    key: 'detail-icome-selected',
    get: ({ get }) => ({id}) => {
        const objectArray = get(icomeState);
        return objectArray.find(obj => obj.id === id) || null;
      },
    }
)