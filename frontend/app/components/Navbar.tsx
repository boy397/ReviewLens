"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Dashboard" },
  ];

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backdropFilter: "blur(24px) saturate(1.2)",
        WebkitBackdropFilter: "blur(24px) saturate(1.2)",
        background: scrolled ? "rgba(5, 5, 8, 0.85)" : "transparent",
        borderBottom: scrolled ? "1px solid var(--border-color)" : "1px solid transparent",
        transition: "all 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 64,
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "linear-gradient(135deg, var(--accent), var(--accent-2))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              fontWeight: 900,
              color: "white",
              boxShadow: "0 2px 12px rgba(129, 140, 248, 0.3)",
            }}
          >
            R
          </div>
          <span
            style={{
              fontSize: "1.15rem",
              fontWeight: 700,
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
            }}
          >
            Review<span style={{ color: "var(--accent)" }}>Lens</span>
          </span>
        </Link>

        {/* Nav Links */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  textDecoration: "none",
                  padding: "7px 18px",
                  borderRadius: 8,
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  color: isActive ? "var(--accent)" : "var(--text-secondary)",
                  background: isActive ? "var(--accent-glow)" : "transparent",
                  transition: "all 0.3s ease",
                }}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/dashboard"
            className="btn-primary"
            style={{ padding: "7px 18px", fontSize: "0.8rem", marginLeft: 8 }}
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
