import type { Effect } from "../wizard.ts";

/**
 * Returns true when an effect depends on the given scope
 */
export const hasScopeDependency = (scope: string) => (effect: Effect) =>
	effect.dependencies.some((dependency) => dependency === scope);
