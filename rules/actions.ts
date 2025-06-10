import { calculateSpreadForCurve } from "./calculate";

const fieldPathMap = {
    rate0: "legs.0.rate",
    rate1: "legs.1.rate",
    spread: "spread"
};

const handleConvert = (
    context: Ticket,
    update: { path: string; value: any } | undefined,
    targetField: "rate0" | "rate1" | "spread"
): number | undefined => {
    const result = calculateSpreadForCurve(context, update);
    return result[targetField];
};

export const actions = [
    {
        fieldUpdate: {
            "legs.0.rate.bid": {
                type: "convert",
                convert: (_field, _input, context: Ticket, update) =>
                    handleConvert(context, update, 'rate0')
            },
            "legs.0.rate.ask": {
                type: "convert",
                convert: (_field, _input, context: Ticket, update) =>
                    handleConvert(context, update, 'rate0')
            },
            "legs.1.rate.bid": {
                type: "convert",
                convert: (_field, _input, context: Ticket, update) =>
                    handleConvert(context, update, 'rate1')
            },
            "legs.1.rate.ask": {
                type: "convert",
                convert: (_field, _input, context: Ticket, update) =>
                    handleConvert(context, update, 'rate1')
            },
            "spread.bid": {
                type: "convert",
                convert: (_field, _input, context: Ticket, update) =>
                    handleConvert(context, update, 'spread')
            },
            "spread.ask": {
                type: "convert",
                convert: (_field, _input, context: Ticket, update) =>
                    handleConvert(context, update, 'spread')
            }
        }
    }
];
