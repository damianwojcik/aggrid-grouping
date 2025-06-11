const func = (legIndex: 0 | 1) => ({
    type: "convert",
    convert: (_field: any, _input: any, context: Ticket, update?: PropertyUpdate) =>
        calculateSpreadForCurve(context, update, legIndex)
});

export const actions = [
    {
        fieldUpdate: {
            "legs.0.rate.bid": func(0),
            "legs.0.rate.ask": func(0),
            "legs.1.rate.bid": func(1),
            "legs.1.rate.ask": func(1)
        }
    }
];
