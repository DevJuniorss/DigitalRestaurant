import React from "react";
import styles from "./NavBar.module.css";

const NAV_ITEMS = [
  { href: "/consulta-cardapio", label: "Cardápio" },
  { href: "/criar-dieta", label: "Dieta" },
  { href: "/adicionar-refeicao", label: "Refeição" },
  { href: "/sobre", label: "Sobre" },
];


export const NavBar: React.FC = () => (
  <ul className={styles.navList}>
    {NAV_ITEMS.map(({ label, href }) => (
      <li key={href}>
        <a href={href} className={styles.navLink}>
          {label}
        </a>
      </li>
    ))}
  </ul>
);

export default NavBar