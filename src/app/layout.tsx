import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MARVEL AI | Choose Your Avenger - AI Character Roulette',
  description:
    'Spin the glowing superhero wheel to unlock Hulk, Iron Man, Captain America, Hawkeye, Black Widow, Spider-Man, or Black Panther as your Gemini AI chatbot persona.',
  keywords: [
    'Marvel AI',
    'Avengers AI',
    'Character Roulette',
    'Iron Man AI',
    'Spider-Man AI',
    'Gemini API',
    'Marvel Chatbot',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-marvel-darker text-gray-100 min-h-screen antialiased selection:bg-marvel-red selection:text-white">
        {children}
      </body>
    </html>
  );
}
