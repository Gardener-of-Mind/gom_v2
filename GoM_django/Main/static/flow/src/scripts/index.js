/* global $ */

require('../styles/index.scss');

import questions from './questions';

import Condition from './Condition';

import renderQuestion from './renderQuestion';
import renderCondition from './renderCondition';

let activeQuestion = 0;
renderQuestion(activeQuestion);

$('#load-next').click(() => {
  if (activeQuestion === questions.length - 1) {
    return;
  }
  activeQuestion++;
  renderQuestion(activeQuestion);
});

$('#load-prev').click(() => {
  if (activeQuestion === 0) {
    return;
  }
  activeQuestion--;
  renderQuestion(activeQuestion);
});

$('#submit').click(() => {
  const noDefaultConditionQuestions = questions.
    filter((q) => q.conditions.length === 0);

  if (noDefaultConditionQuestions.length) {
    alert(`At least default condition must be set:\n${noDefaultConditionQuestions.
      map((q) => `Q ${1 + q.idx})`).
      join('\n')
    }
  `);
  }

  questions.forEach((q) => {
    const noToQuestions = q.conditions.
      filter((c) => !c.to);

    if (noToQuestions.length) {
      alert(`No destination question set:\n${noToQuestions.
        map((c) => `Q ${1 + q.idx}) -> ${c.idx ?
          `Condition ${c.idx}` :
          'Default condition'
        }`).
        join('\n')
      }
    `);
    }

    const incorrectToQuestions = q.conditions.
      filter((c) => c.to < 0 || c.to >= questions.length);

    if (incorrectToQuestions.length) {
      alert(`Incorrect destination question set:\n${incorrectToQuestions.
        map((c) => `Q ${1 + q.idx}) -> ${c.idx ?
          `Condition ${c.idx}` :
          'Default condition'
        }`).
        join('\n')
      }
    `);
    }

    const noValueQuestions = q.conditions.slice(1).
        filter((c) => !c.value);

    if (noValueQuestions.length) {
      alert(`At least default condition must be set:\n${noValueQuestions.
        map((c) => `Q ${1 + q.idx}) - ${c.idx}`).
        join('\n')
      }
    `);
    }
  });

  const data = questions.map((q) =>
    q.conditions.map(({ from, to, value }) =>
      ({ from, to, value })));
  console.log(JSON.stringify(data, null, 2));
});

$('.add-condition').click(() => {
  const question = questions[activeQuestion];
  const condition = new Condition(question);
  question.conditions.push(condition);
  renderCondition(condition);
});
