export type ThemeModules = {
  [key: string]: {
    module: Promise<Record<string, unknown>>;
    light?: string;
    dark?: string;
  };
};
