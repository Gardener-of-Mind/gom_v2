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
  if (questions.some((q) => q.conditions.length === 0)) {
    const errQuestionsList = questions.
      filter((q) => q.conditions.length === 0).
      map((q) => `Q ${1 + q.idx})`).
      join('\n');

    alert(`At least default condition must be set:\n${errQuestionsList}`);
    return;
  }

  questions.forEach((q) => {
    if (q.conditions.slice(1).some((c) => !c.value)) {
      const errQuestionsList = q.conditions.slice(1).
        filter((c) => !c.value).
        map((c) => `Q ${1 + q.idx}) - ${c.idx}`).
        join('\n');

      alert(`At least default condition must be set:\n${errQuestionsList}`);
      return;
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
