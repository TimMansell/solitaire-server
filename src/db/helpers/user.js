import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from 'unique-names-generator';
import shuffle from 'lodash.shuffle';

// eslint-disable-next-line import/prefer-default-export
export const createUserName = () => {
  const [first, second] = shuffle([adjectives, colors, animals]);

  const name = uniqueNamesGenerator({
    dictionaries: [first, second],
    separator: '',
    style: 'capital',
    length: 2,
  });

  return name;
};
