import { fileURLToPath } from "node:url";
import { join, dirname } from "node:path";
import { readFileSync } from "node:fs";

import { starlightMarkdownIntegration } from "starlight-markdown";

const __dirname = dirname(fileURLToPath(import.meta.url));

const normalizeConfig = (options = {}) => ({
  actions: ["copy", "view"],
  injectMarkdownRoutes: true,
  ...options,
});

function starlightContextualMenuIntegration(config) {
  const normalizedConfig = normalizeConfig(config);

  return {
    name: "starlight-contextual-menu",
    hooks: {
      "astro:config:setup": async ({ injectScript }) => {
        const contextualMenuContent = readFileSync(
          join(__dirname, "contextual-menu.js"),
          "utf-8"
        );

        injectScript(
          "page",
          `
            ${contextualMenuContent};
            initContextualMenu(${JSON.stringify({
              actions: normalizedConfig.actions,
            })});          
          `
        );
      },
    },
  };
}

export default function starlightContextualMenu(userConfig) {
  const config = normalizeConfig(userConfig);

  return {
    name: "starlight-contextual-menu-plugin",
    hooks: {
      "config:setup"({ addIntegration }) {
        if (config.injectMarkdownRoutes !== false) {
          addIntegration(starlightMarkdownIntegration(config));
        }
        addIntegration(starlightContextualMenuIntegration(config));
      },
    },
  };
}
