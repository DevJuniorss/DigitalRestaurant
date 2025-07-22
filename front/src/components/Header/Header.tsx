import React from "react";
import { Logo } from "./Logo";
import { NavBar } from "./NavBar";
import { ProfileMenu } from "./ProfileMenu";
import styles from "./Header.module.css";

export const Header: React.FC = () => (
  <header className={styles.header} role="banner">
    <div className={styles.left}>
      <Logo />
    </div>
    <nav className={styles.center} aria-label="Menu principal">
      <NavBar />
    </nav>
    <div className={styles.right}>
      <ProfileMenu />
    </div>
  </header>
);
