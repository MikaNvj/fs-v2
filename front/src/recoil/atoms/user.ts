import {atom, selector} from "recoil";
import { UserTypes} from "../../types";

export const userState = atom<UserTypes[]>({
    key: 'user',
    default: []
});

export const selecteduser = selector({
    key: 'detail-user-selected',
    get: ({ get }) => ({id}: {id: string}) => {
        const objectArray = get(userState);
        return objectArray.find(obj => obj.id === id) || null;
      },
    }
)