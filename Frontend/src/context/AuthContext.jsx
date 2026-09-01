import { createContext,useContext,useState,useEffect } from "react";
import { getUser,logoutUser } from "../services/authService";

const AuthContext = createContext()

export function AuthProvider({children}){
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    useEffect(()=>{
        async function fetchUser() {
            try {
                const data = await getUser()

                setUser(data.user)

            } catch (error) {
                // No valid login cookie = user is not logged in
                setUser(null)
            } finally {
                // Finished checking authentication
                setLoading(false)
            }
        }
        fetchUser()
    },[])
    async function logout(){
        try{
            await logoutUser()
        }catch(error){
            console.log("logout failed",error);   
        }
        finally{
            setUser(null)
        }
    }
    return(
        <AuthContext.Provider 
        value={{user,
            setUser,
            loading,
            logout}}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth(){
    return useContext(AuthContext) //"Give me whatever data is currently inside the AuthContext."
}