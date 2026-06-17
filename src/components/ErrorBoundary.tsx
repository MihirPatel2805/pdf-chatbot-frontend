import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="bg-red-100 p-3 rounded-full">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h1 className="ml-3 text-lg font-medium text-gray-900">
                Application Error
              </h1>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                The application encountered an error. This is likely due to
                missing configuration.
              </p>
              <div className="bg-gray-100 p-3 rounded text-xs font-mono text-gray-700">
                {this.state.error?.message || "Unknown error"}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-900">
                To fix this:
              </h3>
              <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                <li>
                  Create a{" "}
                  <code className="bg-gray-100 px-1 rounded">.env.local</code>{" "}
                  file in the project root
                </li>
                <li>Add your Clerk publishable key</li>
                <li>Restart the development server</li>
              </ol>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="mt-4 w-full bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
