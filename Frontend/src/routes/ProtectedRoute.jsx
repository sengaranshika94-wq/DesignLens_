import { Navigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"

export default function ProtectedRoute({ children }) {
    const { user, loading } = useAuth()

    // While checking the current user, don't redirect yet
    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
        )
    }

    // User is not logged in → send them to login
    if (!user) {
        return <Navigate to="/login" replace />
    }

    // User is logged in → show the requested page
    return children
}