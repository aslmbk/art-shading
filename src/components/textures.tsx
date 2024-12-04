import { cn } from "@/lib/utils";

export const Textures: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  return (
    <div className={cn(className)} {...props}>
      Here'll be the textures
    </div>
  );
};
