export const conditionOperators = {
  'lesser than': 'lt',
  'greater than': 'gt',
  'equal to': 'eq',
};

export const groupOperators = {
  and: 'and',
  or: 'or',
};


export function condition(operator, value, negate = 0) {
  return {
    operator,
    value,
    negate,
  };
}

export function group(conditions, operator = '') {
  return {
    conditions,
    operator,
  };
}

export function evaluate(x, expr) {
  if ('conditions' in expr) {
    return expr.conditions.
      map((c) => evaluate(x, c)).
      reduce((result, cResult) => {
        switch (expr.operator) {
          case 'and':
            return result && cResult;

          case 'or':
            return result || cResult;

          default:
            console.error('Invalid group operator:', expr);
            return -1;
        }
      });
  }

  switch (expr.operator) {
    case 'lt':
      return expr.negate ?
        (x >= expr.value) :
        (x < expr.value);

    case 'gt':
      return expr.negate ?
        (x <= expr.value) :
        (x > expr.value);

    case 'eq':
      return expr.negate ?
        (x !== expr.value) :
        (x === expr.value);

    default:
      console.error('Invalid condition operator:', expr);
      return -1;
  }
}

// const c1 = condition('eq', 10);
// const c2 = condition('gt', 100, 1);
// const c3 = condition('gt', 0);

// const g1 = group([c1, c2], 'or');
// const expr = group([g1, c3], 'and');

// console.log(evaluate(10, expr));
