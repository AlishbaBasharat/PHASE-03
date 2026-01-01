// import '@/styles/globals.css';
// import type { Metadata } from 'next';
// import { Inter } from 'next/font/google';
// import { AuthProvider } from '@/hooks/useAuth';

// const inter = Inter({ subsets: ['latin'] });

// export const metadata: Metadata = {
//   title: 'Todo App',
//   description: 'A secure, multi-user todo application',
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <body className={inter.className}>
//         <AuthProvider>
//           <div className="min-h-screen bg-gray-50">
//             {children}
//           </div>
//         </AuthProvider>
//       </body>
//     </html>
//   );
// }












// import '@/styles/globals.css';
// import type { Metadata } from 'next';
// import { Inter } from 'next/font/google';
// import { AuthProvider } from '@/hooks/useAuth';

// const inter = Inter({ subsets: ['latin'] });

// export const metadata: Metadata = {
//   title: 'Todo App',
//   description: 'A secure, multi-user todo application',
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en" className="dark">
//       <body className={`${inter.className} antialiased`}>
//   <AuthProvider>
//     {children}
//   </AuthProvider>
// </body>
//     </html>
//   );
// }




import '@/styles/globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/hooks/useAuth';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Todo App',
  description: 'A secure, multi-user todo application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}