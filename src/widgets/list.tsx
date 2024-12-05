import { cn } from "@/lib/utils";

export const List: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  return <div className={cn("bg-black", className)} {...props} />;
};
