import { createContext, useContext, useState } from "react";
import { useConfig } from "./configContext";


type AuthType = {
  connect:(password:string)=>boolean;
  connected:boolean
};
const AuthContext = createContext<AuthType| null>(null)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [connected, setConnected] = useState<boolean>(false)
    const { adminPassword } = useConfig()


    const connect = (password: string) => {
        if (password == adminPassword) {
            setConnected(true)
            return true
        }
        else{
            return false
        }
    }


    return (
        <AuthContext.Provider
            value={{connect,connected}}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useConfig must be used within a AuthProvider');
    }
    return context;
}