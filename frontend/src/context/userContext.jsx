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
        const excludedPaths = ['/guest-ide', '/login', '/register'];
        if(!user && !excludedPaths.includes(location.pathname)) {
            axios.get('/profile').then(({data}) => {
                setUser(data);
            })
        }
    }, [location.pathname, user]);
    return (
        <UserContext.Provider value={{user, setUser}}>
            {children}
        </UserContext.Provider>
    )
}