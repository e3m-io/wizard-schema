import type {
	CompoundCondition,
	Condition,
	PredicateCondition,
} from "../wizard.ts";

const getPredicateConditionDependencies = (condition: PredicateCondition) =>
	new Set([Object.entries(condition).at(0)![0]]);

const getCompoundConditionDependencies = (
	condition: CompoundCondition
): Set<string> => {
	if ("AND" in condition) {
		return condition.AND!.reduce(
			(dependencies, condition) =>
				new Set([...dependencies, ...getConditionDependencies(condition)]),
			new Set<string>()
		);
	}

	if ("OR" in condition) {
		return condition.OR!.reduce(
			(dependencies, condition) =>
				new Set([...dependencies, ...getConditionDependencies(condition)]),
			new Set<string>()
		);
	}

	if ("NOT" in condition) {
		return getConditionDependencies(
			condition.NOT as NonNullable<CompoundCondition["NOT"]>
		);
	}

	return new Set<string>();
};

export const getConditionDependencies = (condition: Condition) => {
	if ("AND" in condition || "OR" in condition || "NOT" in condition) {
		return getCompoundConditionDependencies(condition);
	}
	return getPredicateConditionDependencies(condition as PredicateCondition);
};
