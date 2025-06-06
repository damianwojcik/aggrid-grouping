import BigNumber from 'bignumber.js';

type Leg = {
  // Define as needed
};

type Ticket = {
  legs?: Leg[];
};

function getSwapRateForLeg(leg: Leg): number | null | undefined {
  // Replace with real implementation
  return undefined;
}

function getSpread(ticket: Ticket, quoteType: string): number | null | undefined {
  // Replace with real implementation
  return undefined;
}

const calculateSimpleSpread = (
  ticket: Ticket,
  quoteType: string,
  spreadInput: number | null | undefined,
  legIndex: 0 | 1 | 'd'
): number | null | undefined => {
  const legs = ticket?.legs ?? [];

  const aRaw = getSwapRateForLeg(legs[0]);
  const bRaw = getSwapRateForLeg(legs[1]);
  const dRaw = spreadInput ?? getSpread(ticket, quoteType);

  const a = aRaw != null ? new BigNumber(aRaw) : undefined;
  const b = bRaw != null ? new BigNumber(bRaw) : undefined;
  const d = dRaw != null ? new BigNumber(dRaw) : undefined;

  switch (legIndex) {
    case 0: // calculate a
      if (b && d) {
        return b.plus(d.dividedBy(100)).toNumber();
      }
      break;
    case 1: // calculate b
      if (a && d) {
        return a.minus(d.dividedBy(100)).toNumber();
      }
      break;
    case 'd': // calculate spread
      if (a && b) {
        return a.minus(b).times(100).toNumber();
      }
      break;
  }

  return null;
};
