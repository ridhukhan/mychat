import { useState, createContext, useEffect, useContext } from "react";
import api from "../apiinterchapter";
import { toast } from "sonner";

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuth, setIsAuth] = useState(false);

    async function fetchUser() {
        setLoading(true);
        try {
            // baseURL: "/api" dewa thakay ekhane shudhu endpoint hobe
            const { data } = await api.get(`/user/me`); 
            setUser(data.user);
            setIsAuth(true);
        } catch (error) {
            console.log("Fetch user error:", error);
            setUser(null);
            setIsAuth(false);
        } finally {
            setLoading(false);
        }
    }

    async function logoutUser(navigate) {
        try {
            // Endpoint theke /api muche dewa hoyeche jeno 405 error na hoy
            const { data } = await api.post("/user/logout"); 
            toast.success(data.message || "Logged out successfully");
        } catch (error) {
            console.log("Logout error:", error.message);
            toast.error("Logout failed, but clearing session...");
        } finally {
            // API call fail korleo local session clear kora bhalo
            setIsAuth(false);
            setUser(null);
            navigate("/login");
        }
    }

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <AppContext.Provider value={{ setIsAuth, isAuth, user, setUser, loading, logoutUser }}>
            {children}
        </AppContext.Provider>
    );
};

export const AppData = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error("AppData must be used within an AppProvider");
    return context;
};