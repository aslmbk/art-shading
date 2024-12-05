import React, { useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Upload } from "lucide-react";
import { useData } from "@/store/data";

const texturesArr = [1, 2, 3, 4];

export const Textures: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  // prettier-ignore
  const { image1, image2, image3, image4, setImage } = useData();

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

  return (
    <div className={cn("w-full p-4 overflow-y-auto", className)} {...props}>
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
                className="aspect-square bg-secondary hover:bg-secondary/90 border border-border rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 relative overflow-hidden"
              >
                {preview.url ? (
                  <>
                    <img
                      src={preview.url}
                      alt={`Texture ${index}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                      <Upload className="w-6 h-6 text-white" />
                    </div>
                  </>
                ) : (
                  <div className="text-center p-4">
                    <Upload className="w-6 h-6 mx-auto mb-2" />
                    <span className="text-sm">Upload texture {index}</span>
                  </div>
                )}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
};
