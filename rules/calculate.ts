export const calculateSpreadForCurve = (
  ticket: Ticket,
  update?: { path: string; value: number | string }
): Partial<{ rate0: number; rate1: number; spread: number }> => {
  const legs = ticket.legs;
  const spread = ticket.spread;

  if (!legs?.[0] || !legs?.[1]) return {};

  const updatePath = update?.path || "";
  const updateValue = update?.value;

  const maturity0 = updatePath === "legs.0.maturityDate" ? new Date(updateValue) : new Date(legs[0].product.expiryDate);
  const maturity1 = updatePath === "legs.1.maturityDate" ? new Date(updateValue) : new Date(legs[1].product.expiryDate);

  if (!maturity0 || !maturity1) return {};

  const rate0Later = maturity0 >= maturity1;

  const side0 = legs[0].side ?? Side.clientBuy;
  const side1 = legs[1].side ?? Side.clientBuy;

  const rate0 = updatePath.startsWith("legs.0.rate")
    ? new BigNumber(updateValue)
    : legs[0].rate?.[side0] !== undefined
      ? new BigNumber(legs[0].rate[side0])
      : undefined;

  const rate1 = updatePath.startsWith("legs.1.rate")
    ? new BigNumber(updateValue)
    : legs[1].rate?.[side1] !== undefined
      ? new BigNumber(legs[1].rate[side1])
      : undefined;

  const spreadValue = updatePath.startsWith("spread")
    ? new BigNumber(updateValue)
    : spread?.bid !== undefined
      ? new BigNumber(spread.bid)
      : spread?.ask !== undefined
        ? new BigNumber(spread.ask)
        : undefined;

  const result: Partial<{ rate0: number; rate1: number; spread: number }> = {};

  if (rate0 !== undefined && rate1 !== undefined) {
    result.spread = rate0Later
      ? rate0.minus(rate1).times(100).toNumber()
      : rate1.minus(rate0).times(100).toNumber();
  }

  if (spreadValue !== undefined) {
    if (rate0Later && rate1 !== undefined && updatePath.startsWith("spread")) {
      result.rate0 = rate1.plus(spreadValue.dividedBy(100)).toNumber();
    } else if (!rate0Later && rate0 !== undefined && updatePath.startsWith("spread")) {
      result.rate1 = rate0.plus(spreadValue.dividedBy(100)).toNumber();
    }
  }

  if (rate0 !== undefined && updatePath.startsWith("legs.0.rate")) {
    result.rate0 = rate0.toNumber();
  }

  if (rate1 !== undefined && updatePath.startsWith("legs.1.rate")) {
    result.rate1 = rate1.toNumber();
  }

  return result;
};
