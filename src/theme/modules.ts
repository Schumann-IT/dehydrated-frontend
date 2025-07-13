import { ThemeModules } from "@/theme/types.ts";

export const modules: ThemeModules = {
  hansemerkur: {
    module: import("@/theme/hansemerkur"),
    light: "light",
    dark: "dark",
  },
};
