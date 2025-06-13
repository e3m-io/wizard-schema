import type {
	Condition,
	CompoundCondition,
	PredicateCondition,
} from "../wizard.ts";

export const testCondition =
	(getScopeValue: (scope: string) => unknown) =>
	(condition?: Condition): boolean => {
		if (!condition) {
			return true;
		}

		const properties = Object.entries(condition);

		if (properties.length !== 1) {
			throw new Error("Condition must have exactly one property");
		}

		const conditionEntry = properties.at(0)!;

		switch (conditionEntry[0]) {
			case "NOT":
				return !testCondition(getScopeValue)(
					conditionEntry[1] as CompoundCondition["NOT"]
				);
			case "AND":
				return (conditionEntry[1] as CompoundCondition["AND"])!.every(
					(condition) => testCondition(getScopeValue)(condition)
				);
			case "OR":
				return (conditionEntry[1] as CompoundCondition["OR"])!.some(
					(condition) => testCondition(getScopeValue)(condition)
				);
			default:
				break;
		}

		const [scope, operator] = conditionEntry as [
			string,
			PredicateCondition[string]
		];

		const value = getScopeValue(scope);

		if ("equals" in operator) {
			return value === operator.equals!;
		}

		if ("contains" in operator) {
			return operator.contains!.includes(value as string);
		}

		if ("gte" in operator) {
			return (value as number) >= operator.gte!;
		}

		if ("gt" in operator) {
			return (value as number) > operator.gt!;
		}

		if ("lte" in operator) {
			return (value as number) <= operator.lte!;
		}

		if ("lt" in operator) {
			return (value as number) < operator.lt!;
		}

		return false;
	};
