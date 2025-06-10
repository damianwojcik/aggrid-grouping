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

  //

const updatedField =
  path.includes("legs.0.rate") ? "rate0" :
  path.includes("legs.1.rate") ? "rate1" :
 path.includes("spread") ? "spread" :
  null;

// Don't override manually edited value
if (updatedField === "rate0" && rate0 !== undefined) return {};
if (updatedField === "rate1" && rate1 !== undefined) return {};
if (updatedField === "spread" && spreadValue !== undefined) return {};
  //

  const a = rate0Later ? rate0 : rate1;
  const b = rate0Later ? rate1 : rate0;

  const hasAll = a && b && spreadValue;
  if (!hasAll && !isNew) return {};

  if (!spreadValue && a && b) {
    const computedSpread = a.minus(b).times(100).toNumber();
    return {
      rate0: rate0?.toNumber(),
      rate1: rate1?.toNumber(),
      spread: computedSpread
    };
  }

  if (!a && spreadValue && b) {
    const result = b.plus(spreadValue.div(100));
    return {
      rate0: rate0Later ? result.toNumber() : rate0?.toNumber(),
      rate1: !rate0Later ? result.toNumber() : rate1?.toNumber(),
      spread: spreadValue.toNumber()
    };
  }

  if (!b && spreadValue && a) {
    const result = a.minus(spreadValue.div(100));
    return {
      rate0: !rate0Later ? result.toNumber() : rate0?.toNumber(),
      rate1: rate0Later ? result.toNumber() : rate1?.toNumber(),
      spread: spreadValue.toNumber()
    };
  }

  if ((path.includes("rate") || hasAll) && a && b && spreadValue) {
    const computedSpread = a.minus(b).times(100).toNumber();
    return {
      rate0: rate0?.toNumber(),
      rate1: rate1?.toNumber(),
      spread: computedSpread
    };
  }

  if (path.includes("spread") || hasAll) {
    const result = a!.minus(spreadValue!.div(100));
    return {
      rate0: rate0Later ? result.toNumber() : rate0!.toNumber(),
      rate1: !rate0Later ? result.toNumber() : rate1!.toNumber(),
      spread: spreadValue!.toNumber()
    };
  }

  return {};
};
