// app/layout.js
import "./globals.css";

export const metadata = {
  title: "Mi App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        {children}
      </body>
    </html>
  );
}
