const calculateSpreadForCurve = (
  ticket: Ticket,
  update: { path: string; value: number | string } | undefined
): Partial<{ rate0: number; rate1: number; spread: number }> | null => {
  const isNew = ticket?.isNew === true;
  const path = update?.path ?? '';
  const value = update?.value;
  const legs = ticket?.legs;
  const spread = ticket?.spread;

  const maturity0Raw = path === 'legs.0.maturityDate' ? value : legs?.[0]?.product?.expiryDate;
  const maturity1Raw = path === 'legs.1.maturityDate' ? value : legs?.[1]?.product?.expiryDate;
  const maturity0 = maturity0Raw ? new Date(maturity0Raw) : undefined;
  const maturity1 = maturity1Raw ? new Date(maturity1Raw) : undefined;
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
    console.log('[compute spread]', { a: a.toNumber(), b: b.toNumber() });
    const computedSpread = a.minus(b).times(100).toNumber();
    return {
      rate0: rate0?.toNumber(),
      rate1: rate1?.toNumber(),
      spread: computedSpread
    };
  }

  if (!a && spreadValue && b) {
    console.log('[compute a]', { b: b.toNumber(), spread: spreadValue.toNumber() });
    const result = b.plus(spreadValue.dividedBy(100));
    return {
      rate0: rate0Later ? result.toNumber() : rate0?.toNumber(),
      rate1: !rate0Later ? result.toNumber() : rate1?.toNumber(),
      spread: spreadValue.toNumber()
    };
  }

  if (!b && spreadValue && a) {
    console.log('[compute b]', { a: a.toNumber(), spread: spreadValue.toNumber() });
    const result = a.minus(spreadValue.dividedBy(100));
    return {
      rate0: !rate0Later ? result.toNumber() : rate0?.toNumber(),
      rate1: rate0Later ? result.toNumber() : rate1?.toNumber(),
      spread: spreadValue.toNumber()
    };
  }

  //

  if (path.includes('spread')) {
    const result = rate0Later
      ? rate1!.plus(spreadValue!.dividedBy(100))
      : rate0!.plus(spreadValue!.dividedBy(100));
    console.log('[spread updated - recompute rate]', {
      updated: path,
      a: a!.toNumber(),
      b: b!.toNumber(),
      result: result.toNumber()
    });
    return {
      rate0: rate0Later ? rate0!.toNumber() : result.toNumber(),
      rate1: rate0Later ? result.toNumber() : rate1!.toNumber(),
      spread: spreadValue!.toNumber()
    };
  }

  //

  console.log('[all present]', {
    rate0: rate0?.toNumber(),
    rate1: rate1?.toNumber(),
    spread: spreadValue?.toNumber()
  });
  return {
    rate0: rate0?.toNumber(),
    rate1: rate1?.toNumber(),
    spread: spreadValue?.toNumber()
  };
};
