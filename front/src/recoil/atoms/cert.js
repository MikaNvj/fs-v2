import {atom, selector} from "recoil";

export const certState = atom({
    key: 'cert',
    default: []
});
export const selectedcert = selector({
    key: 'detail-cert-selected',
    get: ({ get }) => ({id}) => {
        const objectArray = get(certState);
        return objectArray.find(obj => obj.id === id) || null;
      },
    }
)