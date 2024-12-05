import { cn } from "@/lib/utils";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export const Authorization: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  return (
    <div className={cn(className)} {...props}>
      <Input
        className="mb-4 rounded-none bg-[var(--color-secondary)] border-[var(--color-border)]"
        type="text"
        placeholder="Login"
      />
      <Input
        className="mb-4 rounded-none bg-[var(--color-secondary)] border-[var(--color-border)]"
        type="password"
        placeholder="Password"
      />
      <Button className="rounded-none bg-[var(--color-main)] text-[var(--color-text)]">
        Login
      </Button>
    </div>
  );
};
