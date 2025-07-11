import fs from "fs";
import path from "path";

let content = `import { ThemeModules } from "@/theme/types.ts";\n\n`;
content += `export const modules: ThemeModules = {`;

const p = JSON.parse(fs.readFileSync("./package.json"));

for (const key of Object.keys(p.dependencies || {})) {
  const packagePath = path.resolve("./node_modules/" + key + "/package.json");
  
  // Check if the package exists before trying to read it
  if (!fs.existsSync(packagePath)) {
    console.warn(`Package ${key} not found in node_modules, skipping...`);
    continue;
  }
  
  try {
    const mp = JSON.parse(fs.readFileSync(packagePath));
    if (Object.prototype.hasOwnProperty.call(mp, "react-admin")) {
      if (mp["react-admin"].type === "theme") {
        content += `\n  "${mp["react-admin"].name}": {`;
        content += `\n    module: import("${key}"),`;
        content += `\n    light: "${mp["react-admin"].light || "light"}",`;
        content += `\n    dark: "${mp["react-admin"].dark || "dark"}",`;
        content += `\n  },`;
      }
    }
  } catch (error) {
    console.warn(`Error reading package ${key}:`, error.message);
  }
}

content += `\n};\n`;

fs.writeFileSync(path.resolve("./src/theme/modules.ts"), content);
