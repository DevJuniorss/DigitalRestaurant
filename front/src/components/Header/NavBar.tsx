import React from "react";
import styles from "./NavBar.module.css";


type NavItensProps = {
  href: string;
  label: string;
}
type NavBarProps = {
  navItems?: NavItensProps[];
};

export const NavBar: React.FC<NavBarProps> = ({ navItems }) => (
  <ul className={styles.navList}>
    {navItems?.map(({ label, href }) => (
      <li key={href}>
        <a href={href} className={styles.navLink}>
          {label}
        </a>
      </li>
    ))}
  </ul>
);

export default NavBar