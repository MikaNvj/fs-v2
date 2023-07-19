import {atom, selector} from "recoil";

export const connexionState = atom({
    key: 'connextion',
    default: {}
});
export const selectedconnexion = selector({
    key: 'detail-connexion-selected',
    get: ({ get }) => ({id}) => {
        const objectArray = get(connexionState);
        return objectArray.find(obj => obj.id === id) || null;
      },
    }
)