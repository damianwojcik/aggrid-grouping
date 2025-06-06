import BigNumber from 'bignumber.js';

type Product = {
  expiryDate?: string;
};

type Leg = {
  product?: Product;
};

type Ticket = {
  legs?: Leg[];
};

function getSwapRateForLeg(leg: Leg): number | null | undefined {
  // Replace with actual logic
  return undefined;
}

function getSpread(ticket: Ticket, quoteType: string): number | null | undefined {
  // Replace with actual logic
  return undefined;
}

const calculateSimpleSpread = (
  ticket: Ticket,
  quoteType: string,
  spreadInput: number | null | undefined,
  legIndex: 0 | 1 | 'd'
): number | null | undefined => {
  const legs = ticket?.legs ?? [];

  const date0 = legs[0]?.product?.expiryDate ? new Date(legs[0].product!.expiryDate) : undefined;
  const date1 = legs[1]?.product?.expiryDate ? new Date(legs[1].product!.expiryDate) : undefined;
  if (!date0 || !date1) return null;

  const rate0Raw = getSwapRateForLeg(legs[0]);
  const rate1Raw = getSwapRateForLeg(legs[1]);
  const spreadRaw = spreadInput ?? getSpread(ticket, quoteType);

  const rate0 = rate0Raw != null ? new BigNumber(rate0Raw) : undefined;
  const rate1 = rate1Raw != null ? new BigNumber(rate1Raw) : undefined;
  const spread = spreadRaw != null ? new BigNumber(spreadRaw) : undefined;

  const leg0Later = date0 > date1;
  const [a, b] = leg0Later ? [rate0, rate1] : [rate1, rate0];

  switch (legIndex) {
    case 0: {
      if (rate0) return rate0.toNumber(); // value already known
      if (rate1 && spread) {
        return leg0Later
          ? rate1.plus(spread.dividedBy(100)).toNumber()
          : rate1.minus(spread.dividedBy(100)).toNumber();
      }
      break;
    }
    case 1: {
      if (rate1) return rate1.toNumber(); // value already known
      if (rate0 && spread) {
        return leg1Later(date0, date1)
          ? rate0.plus(spread.dividedBy(100)).toNumber()
          : rate0.minus(spread.dividedBy(100)).toNumber();
      }
      break;
    }
    case 'd': {
      if (spread) return spread.toNumber(); // already provided
      if (a && b) {
        return a.minus(b).times(100).toNumber();
      }
      break;
    }
  }

  return null;
};

function leg1Later(date0: Date, date1: Date): boolean {
  return date1 > date0;
}
