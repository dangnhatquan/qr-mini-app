import React, { createContext } from "react";
import { loginWithZalo } from "@/services/auth";
import { useEffect, useState } from "react";
import { User } from "@/types/user";
import { useNavigate } from "zmp-ui";
import { myQrsRoute } from "@/utils/routes";
import { setString } from "@/utils/storage";

export const AuthContext = createContext<{ user: User | null }>({
  user: null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loginWithZalo()
      .then((res) => {
        setUser(res.user);

        setString("access_token", res.token);
        setString("refresh_token", res.refreshToken);

        const params = new URLSearchParams(window.location.search);
        const page = params.get("page");

        if (page) {
          const targetPath = page.startsWith("/") ? page : `/${page}`;
          navigate(targetPath, { replace: true });
        } else if (window.location.pathname === "/" || window.location.pathname === "/index.html") {
          navigate(myQrsRoute, { replace: true });
        }
      })
      .catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
}
