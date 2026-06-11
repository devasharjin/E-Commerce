import { env } from "@/lib/env";

export default function GoogleSignIn() {
  const handleLogin = () => {
    window.location.href = `${env.backendUrl}/auth/google`;
  };

  return (
    <div className="flex h-[calc(100vh-5rem)] items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-8 shadow-sm backdrop-blur">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
              <svg
                viewBox="0 0 48 48"
                className="h-7 w-7"
              >
                <path
                  fill="#FFC107"
                  d="M43.6 20.5H42V20H24v8h11.3C33.6 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12S17.4 12 24 12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.3 14.7l6.6 4.8C14.7 15 18.9 12 24 12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34 6.1 29.3 4 24 4c-7.7 0-14.4 4.3-17.7 10.7z"
                />
                <path
                  fill="#4CAF50"
                  d="M24 44c5.2 0 9.8-2 13.2-5.2l-6.1-5.2C29 35.1 26.6 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.4 39.5 16.1 44 24 44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.1-3.4 5.6-6.1 7.1l6.1 5.2C39.1 36.8 44 31 44 24c0-1.3-.1-2.4-.4-3.5z"
                />
              </svg>
            </div>

            <h1 className="text-3xl font-bold text-slate-900">
              Welcome Back
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Sign in to access your account and continue shopping.
            </p>
          </div>

          <button
            onClick={handleLogin}
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-white px-4 py-3 font-medium text-slate-700 shadow-sm transition-all hover:shadow-md"
          >
            <svg
              viewBox="0 0 48 48"
              className="h-5 w-5"
            >
              <path
                fill="#FFC107"
                d="M43.6 20.5H42V20H24v8h11.3C33.6 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12S17.4 12 24 12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"
              />
              <path
                fill="#FF3D00"
                d="M6.3 14.7l6.6 4.8C14.7 15 18.9 12 24 12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34 6.1 29.3 4 24 4c-7.7 0-14.4 4.3-17.7 10.7z"
              />
              <path
                fill="#4CAF50"
                d="M24 44c5.2 0 9.8-2 13.2-5.2l-6.1-5.2C29 35.1 26.6 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.4 39.5 16.1 44 24 44z"
              />
              <path
                fill="#1976D2"
                d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.1-3.4 5.6-6.1 7.1l6.1 5.2C39.1 36.8 44 31 44 24c0-1.3-.1-2.4-.4-3.5z"
              />
            </svg>

            Continue with Google
          </button>

          <p className="mt-6 text-center text-xs text-slate-400">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}