import React from "react";
import { Logo } from "./Logo";
import { NavBar } from "./NavBar";
import { ProfileMenu } from "./ProfileMenu";
import styles from "./Header.module.css";
const NAV_ITEMS = [
  { href: "/consulta-cardapio", label: "Cardápio" },
  { href: "/criar-dieta", label: "Dieta" },
  { href: "/adicionar-refeicao", label: "Refeição" },
  { href: "/sobre", label: "Sobre" },
];

export const Header: React.FC = () => (
  <header className={styles.header} role="banner">
    <div className={styles.left}>
      <Logo />
    </div>
    <nav className={styles.center} aria-label="Menu principal">
      <NavBar navItems={NAV_ITEMS} />
    </nav>
    <div className={styles.right}>
      <ProfileMenu />
    </div>
  </header>
);
