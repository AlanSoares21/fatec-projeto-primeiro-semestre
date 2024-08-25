import { createContext, useContext, useState } from "react";

export type TCommomData = {
    user?: {
        name: string;
    };

    setUser(user: {name: string}): any;
}

export const CommomData = createContext<TCommomData>({
    setUser: function (user: { name: string; }) {
        throw new Error("Function not implemented.");
    }
});

export const useCommomData = () => useContext(CommomData)

export function CommomDataProvider() {
    const [userdata, setUserData] = useState<TCommomData['user']>();

    return <CommomData.Provider value={{
        user: userdata,
        setUser: setUserData
    }}>

    </CommomData.Provider>
}