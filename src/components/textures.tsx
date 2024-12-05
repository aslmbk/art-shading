import React, { useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Trash2, Upload } from "lucide-react";
import { useData } from "@/store/data";
import { useConfig } from "@/store/config";

const texturesArr = [1, 2, 3, 4];

export const Textures: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  const colors = useConfig((state) => state.colors);
  const image1 = useData((state) => state.image1);
  const image2 = useData((state) => state.image2);
  const image3 = useData((state) => state.image3);
  const image4 = useData((state) => state.image4);
  const setImage = useData((state) => state.setImage);

  const images = useMemo(
    () => ({
      1: image1,
      2: image2,
      3: image3,
      4: image4,
    }),
    [image1, image2, image3, image4]
  );

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
      const file = event.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => setImage(file, index);
      reader.readAsDataURL(file);
    },
    [setImage]
  );

  const styleColors = useMemo(() => {
    return {
      "--color-main": colors.main,
      "--color-secondary": colors.secondary,
      "--color-border": colors.border,
      "--color-text": colors.text,
    } as React.CSSProperties;
  }, [colors]);

  return (
    <div
      className={cn("w-full p-4 overflow-y-auto", className)}
      {...props}
      style={{ ...props.style, ...styleColors }}
    >
      <div className="grid grid-cols-2 gap-4">
        {texturesArr.map((index) => {
          const preview = images[index as keyof typeof images];

          return (
            <div key={index} className="relative group">
              <input
                className="hidden"
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, index)}
                id={`texture-${index}`}
              />
              <label
                htmlFor={`texture-${index}`}
                className="aspect-square bg-[var(--color-text)] hover:opacity-90 border border-[var(--color-border)] rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 relative"
              >
                {preview.url ? (
                  <>
                    <img
                      src={preview.url}
                      alt={`Texture ${index}`}
                      className="w-full h-full object-cover rounded-md"
                    />
                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-md transition-opacity duration-200">
                      <Upload className="w-6 h-6 stroke-primary-foreground" />
                    </div>
                  </>
                ) : (
                  <div className="text-center p-4">
                    <Upload className="w-6 h-6 mx-auto mb-2 stroke-[var(--color-secondary)]" />
                    <span className="text-sm text-[var(--color-secondary)]">
                      Upload texture {index}
                    </span>
                  </div>
                )}
              </label>
              {preview.url && (
                <div
                  className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-full bg-[var(--color-secondary)] p-2 border border-[var(--color-border)]"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.stopPropagation();
                    setImage(null, index);
                  }}
                >
                  <Trash2 className="w-5 h-5 stroke-[var(--color-text)]" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
