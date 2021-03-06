import {
  validateCardMove,
  validateCardMoveColumn,
  validateFoundationMove,
  validateFoundationMovePosition,
  validateEmptyColumn,
} from '../index';

describe('validation moves', () => {
  describe('validateCardMove', () => {
    describe('card', () => {
      it('should be a valid card', () => {
        const card1 = {
          order: 9,
          suit: '♣',
        };
        const card2 = {
          order: 10,
          suit: '♣',
        };

        const result = validateCardMove(card1, card2);

        expect(result).toBe(true);
      });

      it('should be an invalid card', () => {
        const card1 = {
          order: 9,
          suit: '♣',
        };
        const card2 = {
          order: 8,
          suit: '♦',
        };

        const result = validateCardMove(card1, card2);

        expect(result).toBe(false);
      });

      it('should be a valid card order but invalid card suit', () => {
        const card1 = {
          order: 9,
          suit: '♣',
        };
        const card2 = {
          order: 10,
          suit: '♦',
        };

        const result = validateCardMove(card1, card2);

        expect(result).toBe(false);
      });

      it('should be a valid card suit but invalid card order', () => {
        const card1 = {
          order: 9,
          suit: '♣',
        };
        const card2 = {
          order: 8,
          suit: '♣',
        };

        const result = validateCardMove(card1, card2);

        expect(result).toBe(false);
      });
    });

    describe('king', () => {
      it('should be a valid king', () => {
        const card1 = {
          value: 'K',
          suit: '♣',
        };
        const card2 = {};

        const result = validateCardMove(card1, card2);

        expect(result).toBe(true);
      });

      it('should be an invalid king', () => {
        const card1 = {
          value: 'K',
          suit: '♣',
        };
        const card2 = {
          value: '10',
          suit: '♣',
        };

        const result = validateCardMove(card1, card2);

        expect(result).toBe(false);
      });
    });
  });

  describe('validateCardMoveColumn', () => {
    it('should be a valid column', () => {
      const card = {
        id: 1,
      };
      const cards = [
        {
          id: 2,
        },
      ];

      const result = validateCardMoveColumn(card, cards);

      expect(result).toBe(true);
    });

    it('should be an invalid column', () => {
      const card = {
        id: 1,
      };
      const cards = [
        {
          id: 1,
        },
      ];

      const result = validateCardMoveColumn(card, cards);

      expect(result).toBe(false);
    });
  });

  describe('validateFoundationMove', () => {
    describe('card', () => {
      it('should be a valid card', () => {
        const card = {
          order: 2,
          suit: '♣',
        };
        const cards = [
          {
            order: 1,
            suit: '♣',
          },
        ];

        const result = validateFoundationMove(card, cards);

        expect(result).toBe(true);
      });

      it('should be an invalid card', () => {
        const card = {
          order: 3,
          suit: '♦',
        };
        const cards = [
          {
            order: 1,
            suit: '♣',
          },
        ];

        const result = validateFoundationMove(card, cards);

        expect(result).toBe(false);
      });

      it('should be a valid card order but invalid card suit', () => {
        const card = {
          order: 2,
          suit: '♣',
        };
        const cards = [
          {
            order: 1,
            suit: '♦',
          },
        ];

        const result = validateFoundationMove(card, cards);

        expect(result).toBe(false);
      });

      it('should be a valid card suit but invalid card order', () => {
        const card = {
          order: 3,
          suit: '♣',
        };
        const cards = [
          {
            order: 1,
            suit: '♣',
          },
        ];

        const result = validateFoundationMove(card, cards);

        expect(result).toBe(false);
      });
    });

    describe('ace', () => {
      it('should be a valid ace', () => {
        const card = {
          value: 'A',
          suit: '♣',
        };
        const cards = [];

        const result = validateFoundationMove(card, cards);

        expect(result).toBe(true);
      });

      it('should be an invalid ace', () => {
        const card = {
          value: 'A',
          suit: '♣',
        };
        const cards = [
          {
            value: 'A',
            suit: '♦',
          },
        ];

        const result = validateFoundationMove(card, cards);

        expect(result).toBe(false);
      });
    });
  });

  describe('validateFoundationMovePosition', () => {
    it('should be a valid position', () => {
      const card = {
        id: 3,
      };
      const cards = [
        [],
        [
          {
            id: 5,
          },
          {
            id: 8,
          },
          {
            id: 3,
          },
        ],
      ];

      const result = validateFoundationMovePosition(card, cards);

      expect(result).toBe(true);
    });

    it('should be an invalid position', () => {
      const card = {
        id: 3,
      };
      const cards = [
        [],
        [
          {
            id: 5,
          },
          {
            id: 3,
          },
          {
            id: 8,
          },
        ],
      ];

      const result = validateFoundationMovePosition(card, cards);

      expect(result).toBe(false);
    });
  });

  describe('validateEmptyColumn', () => {
    it('should have no empty columns out of 8', () => {
      const cards = [[], [], [], [], [], [], [], []];

      const result = validateEmptyColumn(cards);

      expect(result).toBe(false);
    });

    it('should have one empty column out of 8', () => {
      const cards = [[], [], [], [], [], [], []];

      const result = validateEmptyColumn(cards);

      expect(result).toBe(true);
    });
  });
});
