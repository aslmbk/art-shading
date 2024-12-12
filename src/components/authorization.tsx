import { cn } from "@/lib/utils";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useAuth } from "@/context/auth-context";
import { useCallback, useState } from "react";
import { supabase } from "@/supabase-client";

export const Authorization: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  const { login, setError, isAuthenticated, user, logout } = useAuth();
  const adminMode = isAuthenticated && user?.token;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = useCallback(async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log(data, error);

    if (error) {
      setError(error.message);
    }

    if (data && data.user && data.session && data.user.email) {
      login({
        id: data.user.id,
        email: data.user.email,
        token: data.session.access_token,
      });
    } else {
      setError("Invalid email or password");
    }
    setEmail("");
    setPassword("");
  }, [email, login, password, setError]);

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    logout();
  }, [logout]);

  return !adminMode ? (
    <div className={cn(className)} {...props}>
      <Input
        className="mb-4 rounded-none bg-[var(--color-secondary)] border-[var(--color-border)]"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        className="mb-4 rounded-none bg-[var(--color-secondary)] border-[var(--color-border)]"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button
        className="rounded-none bg-[var(--color-main)] text-[var(--color-text)]"
        onClick={handleLogin}
      >
        Login
      </Button>
    </div>
  ) : (
    <div className={cn(className)} {...props}>
      <Button
        className="rounded-none bg-[var(--color-main)] text-[var(--color-text)]"
        onClick={handleLogout}
      >
        Logout
      </Button>
    </div>
  );
};
