


const calculateSpreadForCurve = (
  ticket: Ticket,
  quoteType: string,
  spreadInput: number | null | undefined
): Partial<{ rate0: number; rate1: number; spread: number }> | null => {
  const legs = ticket?.legs;

  const maturity0 = legs?.[0]?.product?.expiryDate ? new Date(legs[0].product.expiryDate) : undefined;
  const maturity1 = legs?.[1]?.product?.expiryDate ? new Date(legs[1].product.expiryDate) : undefined;

  if (!maturity0 || !maturity1) return null;

  const rate0Raw = legs?.[0] ? getSwapRateForLeg(legs[0]) : undefined;
  const rate1Raw = legs?.[1] ? getSwapRateForLeg(legs[1]) : undefined;
  const spreadRaw = spreadInput ?? getSpread(ticket, quoteType);

  const rate0 = rate0Raw != null ? new BigNumber(rate0Raw) : undefined;
  const rate1 = rate1Raw != null ? new BigNumber(rate1Raw) : undefined;
  const spread = spreadRaw != null ? new BigNumber(spreadRaw) : undefined;

  const rate0Later = maturity0 >= maturity1; // always prefer second if equal
  const [a, b] = rate0Later ? [rate0, rate1] : [rate1, rate0];

  if (!a || !b) {
    if (spread && b) {
      const result = b.plus(spread.dividedBy(100));
      return rate0Later ? { rate0: result.toNumber() } : { rate1: result.toNumber() };
    }
    if (spread && a) {
      const result = a.minus(spread.dividedBy(100));
      return rate0Later ? { rate1: result.toNumber() } : { rate0: result.toNumber() };
    }
  } else if (!spread) {
    return { spread: a.minus(b).times(100).toNumber() };
  }
  return {};
};

const calculateSpreadForFly = (
  rate0Str?: string,
  rate1Str?: string,
  rate2Str?: string,
  spreadStr?: string
): Partial<{ rate0: number; rate1: number; rate2: number; spread: number }> => {
  const rate0 = rate0Str ? new BigNumber(rate0Str) : undefined;
  const rate1 = rate1Str ? new BigNumber(rate1Str) : undefined;
  const rate2 = rate2Str ? new BigNumber(rate2Str) : undefined;
  const spread = spreadStr ? new BigNumber(spreadStr) : undefined;
  if (!spread && rate0 && rate1 && rate2) {
    return { spread: rate1.times(2).minus(rate0).minus(rate2).times(100).toNumber() };
  }
  if (!rate1 && rate0 && rate2 && spread) {
    return { rate1: rate0.plus(rate2).plus(spread.dividedBy(100)).dividedBy(2).toNumber() };
  }
  if (!rate0 && rate1 && rate2 && spread) {
    return { rate0: rate1.times(2).minus(rate2).minus(spread.dividedBy(100)).toNumber() };
  }
  if (!rate2 && rate0 && rate1 && spread) {
    return { rate2: rate1.times(2).minus(rate0).minus(spread.dividedBy(100)).toNumber() };
  }
  return {};
};

export default function App() {
    const [rate0A, setRate0A] = useState('');
    const [rate1A, setRate1A] = useState('');
    const [spreadA, setSpreadA] = useState('');
    const [maturity0A, setMaturity0A] = useState('');
    const [maturity1A, setMaturity1A] = useState('');

    const [rate0B, setRate0B] = useState('');
    const [rate1B, setRate1B] = useState('');
    const [rate2B, setRate2B] = useState('');
    const [spreadB, setSpreadB] = useState('');

    const resultA = calculateSpreadForCurves(
        parseNumber(rate0A),
        parseNumber(rate1A),
        parseNumber(spreadA),
        parseFloat(maturity0A),
        parseFloat(maturity1A)
    );

    const resultB = calculateSpreadForFly(
        parseNumber(rate0B),
        parseNumber(rate1B),
        parseNumber(rate2B),
        parseNumber(spreadB)
    );

    return (
        <>
            <div>
                {resultA.spread !== undefined && <div>Calculated Spread: {resultA.spread.toFixed(2)} bps</div>}
                {resultA.rate0 !== undefined && <div>Calculated Rate 0: {resultA.rate0.toFixed(6)}</div>}
                {resultA.rate1 !== undefined && <div>Calculated Rate 1: {resultA.rate1.toFixed(6)}</div>}
            </div>

            <div className="mt-4 text-sm">
                {resultB.spread !== undefined && <div>Calculated Spread: {resultB.spread.toFixed(2)} bps</div>}
                {resultB.rate0 !== undefined && <div>Calculated Rate 0: {resultB.rate0.toFixed(6)}</div>}
                {resultB.rate1 !== undefined && <div>Calculated Rate 1: {resultB.rate1.toFixed(6)}</div>}
                {resultB.rate2 !== undefined && <div>Calculated Rate 2: {resultB.rate2.toFixed(6)}</div>}
            </div>
        </>
    );
}
