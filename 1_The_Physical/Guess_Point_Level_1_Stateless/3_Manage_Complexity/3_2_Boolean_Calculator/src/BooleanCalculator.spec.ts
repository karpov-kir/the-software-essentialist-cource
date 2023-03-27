import { BooleanCalculator } from './BooleanCalculator';

const booleanCalculator = new BooleanCalculator();

describe(BooleanCalculator, () => {
  it('sandbox', () => {
    expect(booleanCalculator.isTruthy('TRUE')).toBeTruthy();
  });

  describe('truthy', () => {
    it.each([
      'TRUE',
      'TRUE AND TRUE',
      'FALSE OR TRUE',
      'NOT FALSE',
      'TRUE AND NOT FALSE',
      '(FALSE OR TRUE) AND TRUE',
      '(FALSE OR TRUE) AND (FALSE OR TRUE)',
      '((FALSE OR TRUE) AND (FALSE OR TRUE))',
      '((FALSE OR (FALSE OR TRUE)) AND (FALSE OR TRUE))',
      '(TRUE)',
      '(NOT FALSE)',
      '((FALSE OR (FALSE OR TRUE)) AND (FALSE OR NOT FALSE))',
      '((FALSE OR (FALSE OR TRUE)) AND NOT (TRUE AND FALSE))',
    ])('tells that "%s" is truthy', (booleanExpression) => {
      expect(booleanCalculator.isTruthy(booleanExpression)).toBeTruthy();
    });

    describe('space insensitive', () => {
      it.each([
        ' TRUE  ',
        'TRUE    AND   TRUE',
        '(  (FALSE OR TRUE   ) AND   (FALSE OR TRUE))   ',
        '   ((  FALSE OR (  FALSE OR TRUE)   ) AND (FALSE OR TRUE))',
        '(  TRUE  )',
        '  (NOT FALSE)  ',
      ])('tells that "%s" is truthy', (booleanExpression) => {
        expect(booleanCalculator.isTruthy(booleanExpression)).toBeTruthy();
      });
    });

    describe('case insensitive', () => {
      it.each(['FaLsE Or TrUe', 'FaLsE Or (TrUe aNd tRuE)'])('tells that "%s" is truthy', (booleanExpression) => {
        expect(booleanCalculator.isTruthy(booleanExpression)).toBeTruthy();
      });
    });
  });

  describe('falsy', () => {
    it.each([
      'FALSE',
      'TRUE AND FALSE',
      'FALSE OR TRUE AND FALSE',
      'NOT TRUE',
      'TRUE AND NOT TRUE',
      '(FALSE OR TRUE) AND FALSE',
      '((FALSE OR TRUE) AND FALSE)',
      '((FALSE OR (FALSE OR TRUE)) AND (FALSE OR (TRUE AND FALSE)))',
      '(FALSE)',
      '(NOT TRUE)',
      '((FALSE OR (FALSE OR TRUE)) AND (FALSE OR (FALSE AND NOT TRUE)))',
      '((FALSE OR (FALSE OR TRUE)) AND NOT (FALSE OR TRUE))',
    ])('tells that "%s" is falsy', (booleanExpression) => {
      expect(booleanCalculator.isTruthy(booleanExpression)).toBeFalsy();
    });

    describe('space insensitive', () => {
      it.each([
        ' FALSE  ',
        'TRUE    AND   FALSE',
        '(  (FALSE OR TRUE   ) AND   FALSE  )   ',
        '   ((  FALSE OR (  FALSE OR TRUE)   ) AND (FALSE OR (FALSE))  )',
        '(  FALSE  )',
        '  (NOT TRUE)  ',
      ])('tells that "%s" is truthy', (booleanExpression) => {
        expect(booleanCalculator.isTruthy(booleanExpression)).toBeFalsy();
      });
    });

    describe('case insensitive', () => {
      it.each(['TrUe AnD FaLsE', 'FaLsE Or (TrUe aNd FaLsE)'])('tells that "%s" is falsy', (booleanExpression) => {
        expect(booleanCalculator.isTruthy(booleanExpression)).toBeFalsy();
      });
    });
  });

  describe('unexpected input error', () => {
    it('rejects "TRUE UNEXPECTED FALSE" with an unexpected token error', () => {
      expect(() => booleanCalculator.isTruthy('TRUE UNEXPECTED FALSE')).toThrowError(
        'Error at position 5-14: Unknown token "UNEXPECTED"',
      );
    });

    it('rejects "FALSE OR AND FALSE" with an unexpected token error', () => {
      expect(() => booleanCalculator.isTruthy('FALSE OR AND FALSE')).toThrowError(
        'Error at position 9-11: Expected "TRUE" or "FALSE" or "NOT" or "(" but got "AND"',
      );
    });

    it('rejects "FALSE OR NOT NOT FALSE" with an unexpected token error', () => {
      expect(() => booleanCalculator.isTruthy('FALSE OR NOT NOT FALSE')).toThrowError(
        'Error at position 13-15: Expected "TRUE" or "FALSE" or "(" but got "NOT"',
      );
    });

    it('rejects "NOT NOT" with an unexpected token error', () => {
      expect(() => booleanCalculator.isTruthy('NOT NOT')).toThrowError(
        'Error at position 4-6: Expected "TRUE" or "FALSE" or "(" but got "NOT"',
      );
    });

    it('rejects "TRUE AND TRUE FALSE" with an unexpected token error', () => {
      expect(() => booleanCalculator.isTruthy('TRUE AND TRUE FALSE')).toThrowError(
        'Error at position 14-18: Expected "AND" or "OR" or ")" but got "FALSE"',
      );
    });

    it('rejects "()" with an unexpected token error', () => {
      expect(() => booleanCalculator.isTruthy('()')).toThrowError(
        'Error at position 1-1: Expected "TRUE" or "FALSE" or "NOT" or "(" but got ")"',
      );
    });

    it('rejects "(" rejects with an unexpected token error', () => {
      expect(() => booleanCalculator.isTruthy('()')).toThrowError(
        'Error at position 1-1: Expected "TRUE" or "FALSE" or "NOT" or "(" but got ")"',
      );
    });

    it.each(['(', '(TRUE AND (TRUE OR FALSE', '(TRUE AND (TRUE OR FALSE) AND TRUE'])(
      'rejects "%s" rejects with an unbalanced parenthesis',
      (booleanExpression) => {
        expect(() => booleanCalculator.isTruthy(booleanExpression)).toThrowError('Unbalanced parenthesis');
      },
    );
  });
});
