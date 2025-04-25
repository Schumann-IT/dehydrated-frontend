import fs from "fs";
import path from "path";

let content = `import { ThemeModules } from "@/theme/types.ts";\n\n`;
content += `export const modules: ThemeModules = {`;
const p = JSON.parse(fs.readFileSync("./package.json"));
for (const key of Object.keys(p.dependencies || {})) {
  const mp = JSON.parse(
    fs.readFileSync(path.resolve("./node_modules/" + key + "/package.json")),
  );
  if (Object.prototype.hasOwnProperty.call(mp, "react-admin")) {
    if (mp["react-admin"].type === "theme") {
      content += `\n  "${mp["react-admin"].name}": {`;
      content += `\n    module: import("${key}"),`;
      content += `\n    light: "${mp["react-admin"].light || "light"}",`;
      content += `\n    dark: "${mp["react-admin"].dark || "dark"}",`;
      content += `\n  },`;
    }
  }
}
content += `\n};\n`;

fs.writeFileSync(path.resolve("./src/theme/modules.ts"), content);
