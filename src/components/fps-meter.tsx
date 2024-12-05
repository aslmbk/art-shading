import { useFPS } from "@/hooks/useFPS";
import { cn } from "@/lib/utils";

export const FPSMeter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  const fps = useFPS();

  return (
    <div className={cn("text-xs", className)} {...props}>
      fps: {fps}
    </div>
  );
};
