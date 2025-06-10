import BigNumber from "bignumber.js";

export const calculateSpreadForCurve = (
    ticket: Ticket,
    update?: { path: string; value: number | string }
): Partial<{ rate0: number; rate1: number; spread: number }> | null => {
    const isNew = ticket?.isNew === true;
    const path = update?.path ?? "";
    const value = update?.value;
    const legs = ticket?.legs;
    const spread = ticket?.spread;

    if (!ticket?.legs?.[0] || !ticket.legs[1]) return {};

    const maturity0Raw = path === "legs.0.maturityDate" ? value : legs[0]?.product?.expiryDate;
    const maturity1Raw = path === "legs.1.maturityDate" ? value : legs[1]?.product?.expiryDate;

    const maturity0 = maturity0Raw ? new Date(maturity0Raw) : undefined;
    const maturity1 = maturity1Raw ? new Date(maturity1Raw) : undefined;
    if (!maturity0 || !maturity1) return {};

    const rate0Later = maturity0 >= maturity1;

    const rate0Raw = path.includes("legs.0.rate") ? value : legs[0]?.rate;
    const rate1Raw = path.includes("legs.1.rate") ? value : legs[1]?.rate;
    const spreadRaw =
        path.includes("spread.ask") || path.includes("spread.bid") || path === "spread"
            ? value
            : spread?.ask ?? spread?.bid;

    const rate0 = rate0Raw != null ? new BigNumber(rate0Raw) : undefined;
    const rate1 = rate1Raw != null ? new BigNumber(rate1Raw) : undefined;
    const spreadValue = spreadRaw != null ? new BigNumber(spreadRaw) : undefined;

    const a = rate0Later ? rate0 : rate1;
    const b = rate0Later ? rate1 : rate0;

    const hasAll = a && b && spreadValue;
    // if (!hasAll && !isNew) return {};

    return {
  rate0: rate0?.toNumber() ?? (
    rate0Later && !rate0 && spreadValue && rate1
      ? rate1.plus(spreadValue.dividedBy(100)).toNumber()
      : !rate0Later && !rate0 && rate1 && spreadValue
      ? rate1.minus(spreadValue.dividedBy(100)).toNumber()
      : undefined
  ),
  rate1: rate1?.toNumber() ?? (
    !rate0Later && !rate1 && rate0 && spreadValue
      ? rate0.plus(spreadValue.dividedBy(100)).toNumber()
      : rate0Later && !rate1 && rate0 && spreadValue
      ? rate0.minus(spreadValue.dividedBy(100)).toNumber()
      : undefined
  ),
  spread: spreadValue?.toNumber() ?? (
    rate0 && rate1
      ? rate0Later
        ? rate0.minus(rate1).times(100).toNumber()
        : rate1.minus(rate0).times(100).toNumber()
      : undefined
  )
};

};
