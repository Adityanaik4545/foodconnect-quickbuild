import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  subsets: ["latin"],
});

export const metadata = {
  title: "foodConnect",
  description: "save extra food from being wasted",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={poppins.variable}>
      <body
        className="antialiased"
      >
        {children}
      </body>
    </html>
  );
}
