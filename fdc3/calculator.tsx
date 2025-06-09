import React, { useState } from 'react';
import BigNumber from 'bignumber.js';
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

// Logic for calculation:
// 1. If ticket.isNew === true and ONE of rate0, rate1, spread is missing → calculate the missing one.
// 2. If ticket.isNew === true or false and ALL values are provided → always recalculate spread, or if spread was updated, recalculate the rate with later maturity.


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
    const computedSpread = a.minus(b).times(100).toNumber();
    console.log('[compute spread]', { a: a.toNumber(), b: b.toNumber(), computedSpread });
    return {
      rate0: rate0?.toNumber(),
      rate1: rate1?.toNumber(),
      spread: computedSpread
    };
  }

  if (!a && spreadValue && b) {
    const result = b.plus(spreadValue.dividedBy(100));
    console.log('[compute a (later maturity)]', { b: b.toNumber(), spread: spreadValue.toNumber(), result: result.toNumber() });
    return {
      rate0: rate0Later ? result.toNumber() : rate0?.toNumber(),
      rate1: !rate0Later ? result.toNumber() : rate1?.toNumber(),
      spread: spreadValue.toNumber()
    };
  }

  if (!b && spreadValue && a) {
    const result = a.minus(spreadValue.dividedBy(100));
    console.log('[compute b (earlier maturity)]', { a: a.toNumber(), spread: spreadValue.toNumber(), result: result.toNumber() });
    return {
      rate0: !rate0Later ? result.toNumber() : rate0?.toNumber(),
      rate1: rate0Later ? result.toNumber() : rate1?.toNumber(),
      spread: spreadValue.toNumber()
    };
  }

  if (path.includes('spread') || hasAll) {
    const result = a!.minus(spreadValue!.dividedBy(100));
    console.log('[recalculate later rate due to spread change or all present]', {
      a: a!.toNumber(),
      spread: spreadValue!.toNumber(),
      newRate: result.toNumber()
    });
    return {
      rate0: rate0Later ? result.toNumber() : rate0!.toNumber(),
      rate1: rate0Later ? rate1!.toNumber() : result.toNumber(),
      spread: spreadValue!.toNumber()
    };
  } 
};

export default function App() {
  const fakeTicket = {
    isNew: true,
    legs: [
      {
        product: { expiryDate: '202701' },
        rate: '0.045',
        side: 'buy'
      },
      {
        product: { expiryDate: '202601' },
        rate: '0.042',
        side: 'sell'
      }
    ],
    spread: {
      bid: '30',
      ask: '32'
    }
  };

  const updates = [
    { path: 'spread.ask', value: 32 },
    { path: 'spread.bid', value: 30 },
    { path: 'legs.0.rate.ask', value: 0.045 },
    { path: 'legs.0.rate.bid', value: 0.045 },
    { path: 'legs.1.rate.ask', value: 0.042 },
    { path: 'legs.1.rate.bid', value: 0.042 },
    { path: 'legs.0.maturityDate', value: '202701' },
    { path: 'legs.1.maturityDate', value: '202601' }
  ];

  const results = updates.reduce((acc, update) => {
    acc[update.path] = calculateSpreadForCurve(fakeTicket, update);
    return acc;
  }, {} as Record<string, any>);

  return (
    <div className="p-6 grid gap-6 grid-cols-1 md:grid-cols-2">
      <Card>
        <CardContent className="space-y-2 p-4">
          <h2 className="text-xl font-bold">Spread by Maturity</h2>
          <p className="text-sm italic">spread = (rate with later maturity - rate with earlier maturity) × 100</p>

          <div className="mt-4 text-sm">
            {Object.entries(results).map(([key, result]) => (
              <div key={key} className="mb-2">
                <div className="font-semibold">{key}</div>
                {result?.spread !== undefined && <div>Spread: {result.spread.toFixed(2)}</div>}
                {result?.rate0 !== undefined && <div>Rate 0: {result.rate0.toFixed(6)}</div>}
                {result?.rate1 !== undefined && <div>Rate 1: {result.rate1.toFixed(6)}</div>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
