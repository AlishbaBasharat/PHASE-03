import { createAuthClient } from 'better-auth/react';

// Initialize Better Auth client
export const authClient = createAuthClient({
  // baseURL: process.env.NEXT_PUBLIC_AUTH_URL || 'https://iqoonaz4321-taskneon-app.hf.space',  // Exactly http://localhost:8000
  // baseURL: 'https://iqoonaz4321-taskneon-app.hf.space',
  baseURL: 'http://localhost:8000',
  fetchOptions: {
    // credentials: 'include', // Include cookies in requests
   }
  // cookieOptions: {
  //   sideEffect: true,
  //   sameSite: "none", 
  //   secure: true, // HF https par hai isliye ye true hona chahiye
  // }
});






// import { createAuthClient } from 'better-auth/react';

// export const authClient = createAuthClient({
//   baseURL: 'https://iqoonaz4321-taskneon-app.hf.space',
//   fetchOptions: {
//     credentials: 'include',
//   },
//   // --- YE ADD KAREIN ---
//   cookieOptions: {
//     sideEffect: true, // Frontend par session update karne ke liye
//     domain: ".vercel.app", // Ya apni specific domain
//     secure: true,
//     sameSite: "none", // Cross-site cookies ke liye ye "none" hona lazmi hai
//   }
// });

// export default authClient;