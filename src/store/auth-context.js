import React, { useEffect, useState } from "react";

const AuthContext = React.createContext({
    // default context object
    isLoggedIn: false,
    onLogout: () => {},
    onLogin: (email, password) => {}
})

// 加了這個之後，就可以在context裡面加入useState
export const AuthContextProvider = (props) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(() => {
        // execute by React: run "after" every component re-evalution, only if the dependencies changes
        const storeLoggedInInfo = localStorage.getItem('isLoggedIn')
    
        if (storeLoggedInInfo === '1') {
          setIsLoggedIn(true)
        }
      }, [])
    

    const logoutHandler = () => {
        localStorage.removeItem('isLoggedIn') 
        setIsLoggedIn(false)
    }

    const loginHandler = () => {
        localStorage.setItem('isLoggedIn', '1') 
        setIsLoggedIn(true)
    }


    return <AuthContext.Provider value={{
        isLoggedIn: isLoggedIn,
        onLogout: logoutHandler,
        onLogin: loginHandler
    }}>{props.children}</AuthContext.Provider>
}

export default AuthContext