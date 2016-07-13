import QUESTION_TYPES from './QuestionTypes';

const questions = [
  {
    idx: 0,
    type: QUESTION_TYPES.SHORT,
    head: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo',
    body: 'consequat. Duis aute irure dolor in reprehenderit in  velit esse cillum dolore eu fugiat nulla pariatur. voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    conditions: [],
    element: undefined,
  },
  {
    idx: 1,
    type: QUESTION_TYPES.CHOICE_SINGLE,
    head: 'consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore Lorem ipsum dolor sit amet,  et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo',
    body: 'consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    options: ['Duis aute', 'irure', 'dolor in reprehenderit', 'voluptate'],
    conditions: [],
    element: undefined,
  },
  {
    idx: 2,
    type: QUESTION_TYPES.CHOICE_MULTIPLE,
    head: 'cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore ullamco laboris nisi ut aliquip ex ea commodo',
    body: 'magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation consequat. Duis aute irure dolor in reprehenderit in voluptate Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    options: ['Duis aute', 'Ut enim ad minim', 'dolor in reprehenderit', 'pariatur voluptate'],
    conditions: [],
    element: undefined,
  },
  {
    idx: 3,
    type: QUESTION_TYPES.SHORT,
    head: 'Lorem ullamco laboris nisi ut aliquip ex ea commodo ',
    body: 'consequat. Duis aute irure dolor in reprehenderit in  velit esse cillum dolore eu fugiat nulla pariatur. ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ',
    conditions: [],
    element: undefined,
  },
];

export default questions;
