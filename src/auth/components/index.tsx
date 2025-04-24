import { useEffect, useState } from "react";
import { initializeMsal } from "@/auth";
import { useMsal } from "@azure/msal-react";
import { Navigate, useNavigate } from "react-router-dom";

// MSAL Initialization wrapper
export const MsalInitializer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        await initializeMsal();
        setIsInitialized(true);
      } catch (err) {
        console.error("Failed to initialize MSAL:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      }
    };

    init();
  }, []);

  if (error) {
    return <div>Error initializing authentication: {error.message}</div>;
  }

  if (!isInitialized) {
    return <div>Initializing authentication...</div>;
  }

  return <>{children}</>;
};

// Auth callback component
export const AuthCallback = () => {
  const { instance } = useMsal();
  const navigate = useNavigate();

  useEffect(() => {
    instance
      .handleRedirectPromise()
      .then((response) => {
        if (response) {
          // If we have a successful response, redirect to dashboard
          navigate("/admin");
        }
      })
      .catch((error) => {
        console.error("Error handling redirect:", error);
        // On error, redirect back to landing page
        navigate("/");
      });
  }, [instance, navigate]);

  return <div>Processing authentication...</div>;
};

// Protected route component
export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { instance } = useMsal();
  const accounts = instance.getAllAccounts();

  if (accounts.length === 0) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
