'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/team", label: "Team Progress" },
  { href: "/list", label: "My List" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow-sm shadow-b">
      <div className="max-w-6xl mx-auto px-1 sm:px-4 flex justify-evenly sm:justify-between items-center h-16">
        <Link href="/" className="text-xl font-bold text-accent-600">
          TaskApp
        </Link>
        <div className="contents sm:flex sm:gap-6 sm:items-center text-center">
          {links.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={
                  isActive
                    ? "text-accent-600 font-semibold block max-w-16 sm:max-w-none sm:inline"
                    : "text-gray-600 hover:text-accent-600 block max-w-16 sm:max-w-none sm:inline"
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
