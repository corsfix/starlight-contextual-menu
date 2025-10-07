import type { StarlightPlugin } from "@astrojs/starlight/types";

type ContextualMenuActionType = "copy" | "view" | "claude" | "chatgpt" | "lechat" | "grok";

export interface StarlightContextualMenuUserConfig {
  actions?: ContextualMenuActionType[];
  injectMarkdownRoutes?: boolean;
  hideMainActionLabel?: boolean;
}

export default function starlightContextualMenu(
  userConfig?: StarlightContextualMenuUserConfig
): StarlightPlugin;
