// This file allows the app to access the state throughout the app.

import axios from 'axios';
import { createContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const UserContext = createContext({});

export function UserContextProvider({children}) {
    const [user, setUser] = useState(null);
    const location = useLocation();

    // Fetch user data on mount
    useEffect(() => {
        if(!user && location.pathname !== '/guest-ide') {
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