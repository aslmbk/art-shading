import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const getColorNumbers = (hexColor: string) => {
  let hex = hexColor.replace("#", "");
  if (hex.length !== 3 && hex.length !== 6) hex = "1e1e1e";
  if (hex.length === 3)
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  return {
    r: parseInt(hex.substring(0, 2), 16),
    g: parseInt(hex.substring(2, 4), 16),
    b: parseInt(hex.substring(4, 6), 16),
  };
};

export const lightenColor = (hexColor: string, amount: number = 16): string => {
  const { r, g, b } = getColorNumbers(hexColor);

  const newR = Math.max(0, Math.min(255, r + amount));
  const newG = Math.max(0, Math.min(255, g + amount));
  const newB = Math.max(0, Math.min(255, b + amount));

  const newHex =
    "#" +
    [newR, newG, newB]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("");

  return newHex;
};

export const getBrightness = (hexColor: string): number => {
  const { r, g, b } = getColorNumbers(hexColor);
  // Perceived brightness formula (ITU-R BT.709)
  return (r * 0.2126 + g * 0.7152 + b * 0.0722) / 255;
};

export const fileToBase64 = (file: File) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};
