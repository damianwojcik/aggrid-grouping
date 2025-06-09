const calculateSpreadForCurve = (
  ticket: Ticket,
  isNew: boolean = false
): Partial<{ rate0: number; rate1: number; spread: number }> | null => {
  const legs = ticket?.legs;
  const spread = ticket?.spread;

  const maturity0 = legs?.[0]?.product?.expiryDate ? new Date(legs[0].product.expiryDate) : undefined;
  const maturity1 = legs?.[1]?.product?.expiryDate ? new Date(legs[1].product.expiryDate) : undefined;

  if (!maturity0 || !maturity1) return {};

  const rate0Raw = legs?.[0]?.rate;
  const rate1Raw = legs?.[1]?.rate;
  const rate0 = rate0Raw != null ? new BigNumber(rate0Raw) : undefined;
  const rate1 = rate1Raw != null ? new BigNumber(rate1Raw) : undefined;

  const rate0Later = maturity0 >= maturity1;
  const [a, b] = rate0Later ? [rate0, rate1] : [rate1, rate0];

  const spreadRaw = (rate0Later ? spread?.ask : spread?.bid);
  const spreadValue = spreadRaw != null ? new BigNumber(spreadRaw) : undefined;

  const hasAll = rate0 && rate1 && spreadValue;
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
    const result = b.plus(spreadValue.dividedBy(100));
    return {
      rate0: rate0Later ? result.toNumber() : rate0?.toNumber(),
      rate1: !rate0Later ? result.toNumber() : rate1?.toNumber(),
      spread: spreadValue.toNumber()
    };
  }

  if (!b && spreadValue && a) {
    const result = a.minus(spreadValue.dividedBy(100));
    return {
      rate0: !rate0Later ? result.toNumber() : rate0?.toNumber(),
      rate1: rate0Later ? result.toNumber() : rate1?.toNumber(),
      spread: spreadValue.toNumber()
    };
  }

  return {
    rate0: rate0?.toNumber(),
    rate1: rate1?.toNumber(),
    spread: spreadValue?.toNumber()
  };
};
