import type { StarlightPlugin } from "@astrojs/starlight/types";

type ContextualMenuActionType = "copy" | "view" | "claude" | "chatgpt";

interface ContextualMenuActionObject {
  label: string;
  icon?: string;
  action: () => void;
}

export interface StarlightContextualMenuUserConfig {
  actions: (ContextualMenuActionType | ContextualMenuActionObject)[];
}

export default function starlightContextualMenu(
  userConfig?: StarlightContextualMenuUserConfig
): StarlightPlugin;
