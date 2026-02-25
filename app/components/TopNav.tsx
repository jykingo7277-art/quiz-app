"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type TopNavProps = {
  title?: string;
};

export default function TopNav({ title = "学习系统" }: TopNavProps) {
  const pathname = usePathname();

  const isHome = pathname === "/";
  const isDictation = pathname.startsWith("/dictation");

  const wrapStyle: React.CSSProperties = {
    position: "sticky",
    top: 0,
    zIndex: 50,
    background: "#0b1220",
    borderBottom: "1px solid rgba(255,255,255,0.10)",
    padding: "12px 20px",
  };

  const innerStyle: React.CSSProperties = {
    maxWidth: 860,
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    gap: 12,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: 14,
    fontWeight: 800,
    color: "rgba(255,255,255,0.85)",
    letterSpacing: 0.2,
  };

  const tabsStyle: React.CSSProperties = {
    marginLeft: "auto",
    display: "flex",
    gap: 8,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 999,
    padding: 6,
  };

  const tabBase: React.CSSProperties = {
    display: "inline-block",
    padding: "8px 14px",
    borderRadius: 999,
    textDecoration: "none",
    fontWeight: 800,
    fontSize: 13,
    lineHeight: 1,
    transition: "transform 120ms ease",
  };

  const tabActive: React.CSSProperties = {
    ...tabBase,
    background: "#2563eb",
    color: "white",
  };

  const tabInactive: React.CSSProperties = {
    ...tabBase,
    background: "transparent",
    color: "rgba(255,255,255,0.80)",
  };

  return (
    <div style={wrapStyle}>
      <div style={innerStyle}>
        <div style={titleStyle}>{title}</div>

        <div style={tabsStyle}>
          <Link href="/" style={isHome ? tabActive : tabInactive}>
            刷题
          </Link>
          <Link href="/dictation" style={isDictation ? tabActive : tabInactive}>
            听写
          </Link>
        </div>
      </div>
    </div>
  );
}