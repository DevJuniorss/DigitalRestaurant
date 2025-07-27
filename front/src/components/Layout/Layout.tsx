// components/Layout/Layout.tsx
import { useRouter } from "next/router";
import { Header } from "../Header/Header";

type LayoutProps = {
  children: React.ReactNode;
  excludeHeaderRoutes?: string[];
};

// O Layout aceita uma lista de rotas sem Header (OCP)
export const Layout = ({
  children,
  excludeHeaderRoutes = ["/login", "/"],
}: LayoutProps) => {
  const { pathname } = useRouter();
  const showHeader = !excludeHeaderRoutes.includes(pathname);

  return (
    <>
      {showHeader && <Header />}
      <main>{children}</main>
    </>
  );
};
