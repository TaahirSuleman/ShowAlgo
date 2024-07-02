// This file allows the app to access the state throughout the app.

import axios from 'axios';
import { createContext, useState, useEffect } from 'react';

export const UserContext = createContext({});

export function UserContextProvider({children}) {
    const [user, setUser] = useState(null);
    // Fetch user data on mount
    useEffect(() => {
        if(!user) {
            axios.get('/profile').then(({data}) => {
                setUser(data);
            })
        }
    }, [])
    return (
        <UserContext.Provider value={{user, setUser}}>
            {children}
        </UserContext.Provider>
    )
}