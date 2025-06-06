import BigNumber from 'bignumber.js';


const calculate = (
  ticket: Ticket,
  quoteType: string,
  spreadInput: number | null | undefined,
  legIndex: 0 | 1 | 2 | 'd'
): number | null | undefined => {
  const legs = ticket?.legs ?? [];

  const aRaw = getSwapRateForLeg(legs[0]);
  const bRaw = getSwapRateForLeg(legs[1]);
  const cRaw = getSwapRateForLeg(legs[2]);
  const dRaw = spreadInput ?? getSpread(ticket, quoteType);

  const a = aRaw != null ? new BigNumber(aRaw) : undefined;
  const b = bRaw != null ? new BigNumber(bRaw) : undefined;
  const c = cRaw != null ? new BigNumber(cRaw) : undefined;
  const d = dRaw != null ? new BigNumber(dRaw) : undefined;

  switch (legIndex) {
    case 0: // calculate a
      if (b && c && d) {
        return b.times(2).minus(c).minus(d.dividedBy(100)).toNumber();
      }
      break;
    case 1: // calculate b
      if (a && c && d) {
        return a.plus(c).plus(d.dividedBy(100)).dividedBy(2).toNumber();
      }
      break;
    case 2: // calculate c
      if (a && b && d) {
        return b.times(2).minus(a).minus(d.dividedBy(100)).toNumber();
      }
      break;
    case 'd': // calculate spread
      if (a && b && c) {
        return b.times(2).minus(a).minus(c).times(100).toNumber();
      }
      break;
  }

  return null;
};
