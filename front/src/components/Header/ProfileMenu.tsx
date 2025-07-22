import React, { useState, useEffect, useRef } from "react";
import styles from "./ProfileMenu.module.css";

const PROFILE_OPTIONS = [
  { label: "Perfil", href: "/perfil", icon: "👤" },
  { label: "Configurações", href: "/configuracoes", icon: "⚙️" },
  { label: "Sair", action: () => { /* logout logic */ }, icon: "🚪" },
];

export const ProfileMenu: React.FC = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className={styles.profileMenu} ref={ref}>
      <button
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className={styles.profileButton}
        aria-label="Abrir menu do perfil"
      >
        <div className={styles.profileIcon}>👤</div>
      </button>
      {open && (
        <div className={styles.menu} role="menu">
          {PROFILE_OPTIONS.map(({ label, href, action, icon }) =>
            href ? (
              <a key={label} href={href} role="menuitem" className={styles.menuItem}>
                <span className={styles.icon}>{icon}</span> {label}
              </a>
            ) : (
              <button
                key={label}
                onClick={action}
                role="menuitem"
                className={`${styles.menuItem} ${styles.buttonAction}`}
              >
                <span className={styles.icon}>{icon}</span> {label}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
};
