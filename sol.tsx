const userMatchers: Matcher[] = [
  ...(needParentheses ? [createMatcher({ comparison: '(', operator: 'and' })] : []),
  ...matchers,
  ...(needParentheses ? [createMatcher({ comparison: ')', operator: 'and' })] : []),
];
