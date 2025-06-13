import { testCondition } from "../condition/testCondition";
import type { Effect } from "../wizard";
import { hasScopeDependency } from "./hasScopeDependency";

export const getScheduledEffectActions =
	(getScopeValue: (scope: string) => unknown, effects: Effect[]) =>
	(changedScope: string) =>
		effects
			// Filter out effects that don't have an affected dependency
			.filter(hasScopeDependency(changedScope))
			// Flatten all of the actions from each effect
			.flatMap((effect) => effect.actions)
			// Filter out the actions that don't have a passing condition
			.filter((action) => testCondition(getScopeValue)(action.condition));
