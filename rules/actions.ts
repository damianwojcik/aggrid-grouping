import { calculateSpreadForCurve } from "./calculate";

const handleConvert = (
  context: Ticket,
  update: { path: string; value: any; applyToTarget?: boolean } | undefined
): Partial<{ rate0: number; rate1: number; spread: number }> | undefined => {
  if (!update?.value) return;

  const shouldRecalculate =
   update.path.includes("maturityDate") ||
  update.path.includes("rate") ||
  (update.path.includes("spread") && update.applyToTarget);

  if (shouldRecalculate) {
    return calculateSpreadForCurve(context, update);
  }

  return;
};

export const actions = [
  {
    fieldUpdate: {
      "legs.0.rate": {
        type: "convert",
        convert: (_field, _input, context: Ticket, update) =>
          handleConvert(context, update)
      },
      "legs.1.rate": {
        type: "convert",
        convert: (_field, _input, context: Ticket, update) =>
          handleConvert(context, update)
      },
      "spread": {
        type: "convert",
        convert: (_field, _input, context: Ticket, update) =>
          handleConvert(context, update)
      }
    }
  }
];
