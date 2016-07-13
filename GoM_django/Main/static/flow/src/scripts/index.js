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
