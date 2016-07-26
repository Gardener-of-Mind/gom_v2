/* global $ */

import QUESTION_TYPES from './QuestionTypes';

import { addGroupBtn } from './Score';

export default class Condition {
  constructor(question, type = '') {
    this.question = question;
    this.idx = question.conditions.length;
    this.default = (type === 'default');

    this.from = question.idx;
    this.to = 1 + question.idx;
    this.value = undefined;

    this.scoreCondition = null;

    console.log(question.query_type, QUESTION_TYPES.checkbox)
    if (type !== 'default') {
      switch (question.query_type) {
        case QUESTION_TYPES.text:
          this.text();
          break;

        case QUESTION_TYPES.radio:
          this.radio();
          break;

        case QUESTION_TYPES.checkbox:
          this.checkbox();
          break;

        case QUESTION_TYPES.dual:
          this.dual();
          break;

        case QUESTION_TYPES.rating:
          this.rating();
          break;

        case QUESTION_TYPES.dropdownbox:
          this.dropdownbox();
          break;

        default:
      }

      // this.score();
    }
  }

  text() {
    const $element = $(`
      <div class="col-md-10 col-md-offset-1">
        <div class="from-group">
          <label class="col-md-3 control-label">Value:</label>
          <div class="col-md-9">
            <input type="text" class="form-control" name="value" placeholder="Condition value" />
          </div>
        </div>
      </div>
    `);

    $element.find('input').change((e) => {
      this.value = e.target.value;
    });

    this.element = $element;
  }

  radio() {
    const $element = $(`
      <div class="col-md-10 col-md-offset-1">
        <div class="form-group">
          <div class="radio">
          </div>
        </div>
      </div>
    `);
    for (let i = 0; i < this.question.options.length; i++) {
      $element.find('.radio').append(`
        <div class="col-md-2">
          <label class="radio-inline">
            <input type="radio" name="value" value="${i}" />
            <span>Option ${String.fromCharCode(65 + i)}</span>
          </label>
        </div>
      `);
    }
    $element.find('input[name="value"]').change((e) => {
      this.value = e.target.value;
    });
    this.element = $element;
  }

  checkbox() {
    const $element = $(`
      <div class="col-md-10 col-md-offset-1">
        <div class="form-group">
          <div class="checkbox">
          </div>
        </div>
      </div>
    `);
    for (let i = 0; i < this.question.options.length; i++) {
      $element.find('.checkbox').append(`
        <div class="col-md-2">
          <label class="checkbox-inline">
            <input type="checkbox" name="value" value="${i}" />
            <span>Option ${String.fromCharCode(65 + i)}</span>
          </label>
        </div>
      `);
    }
    $element.find('input[name="value"]').change(() => {
      const checkboxes = $element.find('input[type="checkbox"]');
      const checked = [];
      for (let i = 0; i < checkboxes.length; i++) {
        checked.push(checkboxes[i].checked);
      }
      this.value = checked;
    });
    this.element = $element;
  }

  dual() {
    const $element = $(`
      <div class="col-md-10 col-md-offset-1">
        <div class="form-group">
          <div class="radio">
          </div>
        </div>
      </div>
    `);
    for (let i = 0; i < 2; i++) {
      $element.find('.radio').append(`
        <div class="col-md-2">
          <label class="radio-inline">
            <input type="radio" name="value" value="${i}" />
            <span>Option ${String.fromCharCode(65 + i)}</span>
          </label>
        </div>
      `);
    }
    $element.find('input[name="value"]').change((e) => {
      this.value = e.target.value;
    });
    this.element = $element;
  }

  rating() {
    const $element = $(`
      <div class="col-md-10 col-md-offset-1">
        <div class="from-group">
          <label class="col-md-3 control-label">Value:</label>
          <div class="col-md-2">
            <select class="form-control" name="value" title="Condition value">
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
          </div>
        </div>
      </div>
    `);

    $element.find('select').change((e) => {
      this.value = e.target.value;
    });
    this.value = '1';

    this.element = $element;
  }

  dropdownbox() {
    const $element = $(`
      <div class="col-md-10 col-md-offset-1">
        <div class="form-group">
          <div class="radio">
          </div>
        </div>
      </div>
    `);
    for (let i = 0; i < this.question.options.length; i++) {
      $element.find('.radio').append(`
        <div class="col-md-2">
          <label class="radio-inline">
            <input type="radio" name="value" value="${i}" />
            <span>Option ${String.fromCharCode(65 + i)}</span>
          </label>
        </div>
      `);
    }
    $element.find('input[name="value"]').change((e) => {
      this.value = e.target.value;
    });
    this.element = $element;
  }

  score() {
    const $scoreInput = $(`
      <input
        type="text"
        class="form-control"
        id="score"
        placeholder="Score condition"
      >`)[0];
    $scoreInput.onfocus = () => {
      $('#score-modal').modal();
      $('#score-modal').data('curr', `${this.from}/${this.idx}`);
      $('#score-modal .modal-body').html(addGroupBtn);
    };

    const $scoreElement = $(`
      <div class="from-group">
        <label class="col-md-3 control-label">Score:</label>
        <div class="col-md-9"></div>
      </div>
    `);

    $scoreElement.find('div').append($scoreInput);

    this.element.append($scoreElement);
  }
}
