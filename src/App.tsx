import {
  ClerkProvider,
  RedirectToSignIn,
  SignedIn,
  SignedOut,
} from "@clerk/clerk-react";
import { Toaster } from "react-hot-toast";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";

// Components
import ErrorBoundary from "./components/ErrorBoundary";
import Layout from "./components/Layout";
import Chat from "./pages/Chat";
import Dashboard from "./pages/Dashboard";
import LandingPage from "./pages/LandingPage";
import Profile from "./pages/Profile";
import Sessions from "./pages/Sessions";

// Get Clerk publishable key from environment variables
const clerkPubKey =
  process.env.REACT_APP_CLERK_PUBLISHABLE_KEY || "pk_test_placeholder_key";

// For development, we'll use a placeholder key if none is provided
if (!process.env.REACT_APP_CLERK_PUBLISHABLE_KEY) {
  console.warn(
    "⚠️ No Clerk publishable key found. Using placeholder key for development."
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ClerkProvider publishableKey={clerkPubKey}>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: "#363636",
                  color: "#fff",
                },
              }}
            />

            <Routes>
              {/* Public routes */}
              <Route path="/" element={<LandingPage />} />

              {/* Protected routes */}
              <Route
                path="/dashboard"
                element={
                  <>
                    <SignedIn>
                      <Layout>
                        <Dashboard />
                      </Layout>
                    </SignedIn>
                    <SignedOut>
                      <RedirectToSignIn />
                    </SignedOut>
                  </>
                }
              />

              <Route
                path="/chat/:sessionId?"
                element={
                  <>
                    <SignedIn>
                      <Layout>
                        <Chat />
                      </Layout>
                    </SignedIn>
                    <SignedOut>
                      <RedirectToSignIn />
                    </SignedOut>
                  </>
                }
              />

              <Route
                path="/sessions"
                element={
                  <>
                    <SignedIn>
                      <Layout>
                        <Sessions />
                      </Layout>
                    </SignedIn>
                    <SignedOut>
                      <RedirectToSignIn />
                    </SignedOut>
                  </>
                }
              />

              <Route
                path="/profile"
                element={
                  <>
                    <SignedIn>
                      <Layout>
                        <Profile />
                      </Layout>
                    </SignedIn>
                    <SignedOut>
                      <RedirectToSignIn />
                    </SignedOut>
                  </>
                }
              />

              {/* Redirect to dashboard for authenticated users */}
              <Route
                path="/sign-in"
                element={
                  <>
                    <SignedIn>
                      <Navigate to="/dashboard" replace />
                    </SignedIn>
                    <SignedOut>
                      <RedirectToSignIn />
                    </SignedOut>
                  </>
                }
              />

              <Route
                path="/sign-up"
                element={
                  <>
                    <SignedIn>
                      <Navigate to="/dashboard" replace />
                    </SignedIn>
                    <SignedOut>
                      <RedirectToSignIn />
                    </SignedOut>
                  </>
                }
              />
            </Routes>
          </div>
        </Router>
      </ClerkProvider>
    </ErrorBoundary>
  );
}

export default App;
