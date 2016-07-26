/* global $ */

const conditionOperators = {
  'lesser than': 'lt',
  'greater than': 'gt',
  'equal to': 'eq',
};

const groupOperators = {
  and: 'and',
  or: 'or',
};


function condition(operator, value, negate = 0) {
  return {
    operator,
    value,
    negate,
  };
}

function group(conditions, operator = '') {
  return {
    conditions,
    operator,
  };
}

function evaluate(x, expr) {
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


const state = {
  groupCount: 0,
  conditionCount: 0,
};

function addCondition(groupIdx) {
  const $conditionElement = $(`
    <div style="background-color:#ddd;">
      <label>
        Score:
      </label>

      <select>
        ${Object.keys(conditionOperators).map((op) => (
          `<option>
            ${op}
          </option>`
        )).join('')}
      </select>

      <input type="number" id="value" placeholder="Value" title="Value">

      <input type="checkbox" id="negate" title="Negate">
    </div>
  `);

  $(`#score-expression-group-${groupIdx}`).append($conditionElement);
  console.log(groupIdx);
}

function addGroup() {
  const idx = state.groupCount++;
  const $groupElement = $(`
    <div
      class="score-expression-group" id="score-expression-group-${idx}"
      style="background-color:#eee;"
    >
      <select id="operator">
        <option value='and'>and</option>
        <option value='or'>or</option>
      </select>
    </div>
  `);

  const btn = $('<button> + </button>')[0];
  btn.onclick = () => addCondition(idx);
  $groupElement.append(btn);
  $('#score-modal .modal-body').append($groupElement);
}

const addGroupBtn = $('<button title="Add Group">+</button>')[0];
addGroupBtn.onclick = addGroup;

export { addGroupBtn };
