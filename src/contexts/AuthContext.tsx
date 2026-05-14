import React, { createContext } from "react";
import { loginWithZalo } from "@/services/auth";
import { useEffect, useState } from "react";
import { User } from "@/types/user";
import { useNavigate } from "zmp-ui";
import { myQrsRoute } from "@/utils/routes";
import { storage } from "@/utils/storage";

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

        storage.setItem("access_token", res.token);
        storage.setItem("refresh_token", res.refreshToken);

        const path = window.location.pathname;

        if (path) {
          if (path === "/") {
            navigate(myQrsRoute, { replace: true });
          } else {
            navigate(path, { replace: true });
          }
        }
      })
      .catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
}
