import "./globals.css"; // Optional: Import global CSS for styling

export const metadata = {
  title: "Society Management App",
  description: "Manage members and operations for your society.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        {/* Main Content */}
        <main>{children}</main>
      </body>
    </html>
  );
}
