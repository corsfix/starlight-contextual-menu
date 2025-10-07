import type { StarlightPlugin } from "@astrojs/starlight/types";

type ContextualMenuActionType = "copy" | "view" | "claude" | "chatgpt";

export interface StarlightContextualMenuUserConfig {
  actions?: ContextualMenuActionType[];
  injectMarkdownRoutes?: boolean;
}

export default function starlightContextualMenu(
  userConfig?: StarlightContextualMenuUserConfig
): StarlightPlugin;
