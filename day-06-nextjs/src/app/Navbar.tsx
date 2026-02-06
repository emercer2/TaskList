'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/team", label: "Team Progress" },
  { href: "/list", label: "My List" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow-sm shadow-b">
      <div className="max-w-6xl mx-auto px-4 flex justify-between items-center h-16">
        <Link href="/" className="text-xl font-bold text-blue-600">
          TaskApp
        </Link>
        <div className="flex gap-6">
          {links.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={
                  isActive
                    ? "text-blue-600 font-semibold"
                    : "text-gray-600 hover:text-blue-600"
                }
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
