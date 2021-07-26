import { pascalCase } from '../../../src/helpers';

test('pascalCase util', () => {
  const kebabCase = 'to-pascal-case';

  expect(pascalCase(kebabCase)).toBe('ToPascalCase');
});