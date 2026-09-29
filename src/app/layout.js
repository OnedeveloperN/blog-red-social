import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import './globals.css';

export const metadata = {
  title: 'SocialBlog - Red Social de Publicaciones',
  description: 'Aplicación de blog y red social construida con Next.js, Tailwind CSS y MongoDB',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col font-sans">
        <AuthProvider>
          <Navbar />
          <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-6">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}