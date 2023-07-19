import {atom, selector} from "recoil";

export const userState = atom({
    key: 'user',
    default: []
});
export const selecteduser = selector({
    key: 'detail-user-selected',
    get: ({ get }) => ({id}) => {
        const objectArray = get(userState);
        return objectArray.find(obj => obj.id === id) || null;
      },
    }
)