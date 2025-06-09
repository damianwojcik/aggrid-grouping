const calculateSpreadForCurve = (
  ticket: Ticket,
  update: { path: string; value: number | string }
): Partial<{ rate0: number; rate1: number; spread: number }> | null => {
  const isNew = ticket?.isNew === true;
  const { path, value } = update;
  const legs = ticket?.legs;
  const spread = ticket?.spread;

  const maturity0 = legs?.[0]?.product?.expiryDate ? new Date(legs[0].product.expiryDate) : undefined;
  const maturity1 = legs?.[1]?.product?.expiryDate ? new Date(legs[1].product.expiryDate) : undefined;
  if (!maturity0 || !maturity1) return {};

  const rate0Later = maturity0 >= maturity1;

  const rate0Raw = path.includes('legs.0.rate') ? value : legs?.[0]?.rate;
  const rate1Raw = path.includes('legs.1.rate') ? value : legs?.[1]?.rate;
  const spreadRaw =
    path.includes('spread.ask') ? value :
    path.includes('spread.bid') ? value :
    path.includes('.ask') ? spread?.ask :
    path.includes('.bid') ? spread?.bid :
    undefined;

  const rate0 = rate0Raw != null ? new BigNumber(rate0Raw) : undefined;
  const rate1 = rate1Raw != null ? new BigNumber(rate1Raw) : undefined;
  const spreadValue = spreadRaw != null ? new BigNumber(spreadRaw) : undefined;

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
