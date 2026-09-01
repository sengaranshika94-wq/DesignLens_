import { Routes, Route, useLocation } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { Suspense, lazy } from "react"
import ProtectedRoute from "./ProtectedRoute"
const LandingPage = lazy(() => import("@/pages/LandingPage"))
const LoginPage = lazy(() => import("@/pages/LoginPage"))
const RegisterPage = lazy(() => import("@/pages/RegisterPage"))
const AnalyzePage = lazy(() => import("@/pages/AnalyzePage"))
const ResultsPage = lazy(() => import("@/pages/ResultsPage"))
const DashboardPage = lazy(() => import("@/pages/DashboardPage"))
const HistoryPage = lazy(() => import("@/pages/HistoryPage"))
const SettingsPage = lazy(() => import("@/pages/SettingsPage"))

function PageLoader() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent"
            />
        </div>
    )
}

export default function AppRoutes() {

    const location = useLocation()

    return (
        <Suspense fallback={<PageLoader />}>
            <AnimatePresence mode="wait">
                <Routes
                    location={location}
                    key={location.pathname}
                >
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <DashboardPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/analyze"
                        element={
                            <ProtectedRoute>
                                <AnalyzePage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/results"
                        element={
                            <ProtectedRoute>
                                <ResultsPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/history"
                        element={
                            <ProtectedRoute>
                                <HistoryPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/settings"
                        element={
                            <ProtectedRoute>
                                <SettingsPage />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </AnimatePresence>
        </Suspense>
    )
}