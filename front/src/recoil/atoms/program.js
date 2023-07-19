import {atom, selector} from "recoil";

export const programState = atom({
    key: 'program',
    default: []
});
export const selectedprogram = selector({
    key: 'detail-program-selected',
    get: ({ get }) => ({id}) => {
        const objectArray = get(programState);
        return objectArray.find(obj => obj.id === id) || null;
      },
    }
)