module.exports = {
  env: {
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            // Policy to ensure same-origin and cross-origin isolation for added security
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin", // Options: "same-origin", "same-origin-allow-popups", "unsafe-none"

            // Policy to enforce same-origin embedding and require credentials for cross-origin resources
            key: "Cross-Origin-Embedder-Policy",
            value: "require-corp", // Options: "unsafe-none", "require-corp"

            // Policy to define how resources can be shared across different origins
            key: "Cross-Origin-Resource-Policy",
            value: "cross-origin", // Options: "same-origin", "same-site", "cross-origin"

            // Allows all origins to access the resources (CORS)
            key: "Access-Control-Allow-Origin",
            value: "*", // Options: "*", "specific-origin" (e.g., "https://example.com")

            // Specifies the HTTP methods that are allowed when accessing the resource in a cross-origin request
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS", // Options: Combinations of "GET", "POST", "PUT", "DELETE", "OPTIONS", etc.

            // Defines which headers can be used in the actual request
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization" // Options: Any specific headers required (e.g., "Content-Type, Authorization, X-Custom-Header")
          }
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/__/auth/:path*',
        destination: `https://${process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}/__/auth/:path*`,
      },
    ];
  },
};
