import { mockStats } from '../../../../src/mockData';

Cypress.Commands.add(
  'mockApi',
  (
    { mockDeck, mockInitial, mockSaveGame, mockCreateUser, mockGetUser } = {
      mockDeck: [],
      mockInitial: false,
      mockSaveGame: false,
      mockCreateUser: false,
      mockGetUser: false,
    }
  ) => {
    cy.wrap(false).as('mockedInitial');

    if (mockDeck) {
      cy.mockNewGameAPI(mockDeck);
    }

    if (mockInitial) {
      cy.mockInitialDataAPI(mockInitial);
      cy.wrap(true).as('mockedInitial');
    }

    if (mockSaveGame) {
      cy.mockSaveGameAPI();
    }

    if (mockCreateUser) {
      cy.mockCreateUserAPI();
    }

    if (mockGetUser) {
      cy.mockGetUserAPI();
    }
  }
);

Cypress.Commands.add('getStats', () => {
  const uid = localStorage.getItem('luid');

  const query = `query {
    userStats(uid: "${uid}") {
      won
      lost
      completed
    }
    globalStats {
      won
      lost
      completed
    }
  }`;

  cy.request({
    method: 'POST',
    url: '.netlify/functions/graphql',
    body: { query },
    failOnStatusCode: false,
  }).then(({ body }) => {
    const {
      data: { globalStats, userStats },
    } = body;

    cy.wrap(userStats).as('userStats');
    cy.wrap(globalStats).as('globalStats');
  });
});

Cypress.Commands.add('interceptLeaderboardAPI', () => {
  cy.intercept('POST', '.netlify/functions/graphql', (req) => {
    const { body } = req;

    if (body?.query.includes('query Leaderboards')) {
      // eslint-disable-next-line no-param-reassign
      req.alias = 'waitForLeaderboardAPI';
    }
  });
});

Cypress.Commands.add('interceptInitialDataAPI', () => {
  cy.intercept('POST', '.netlify/functions/graphql', (req) => {
    const { body } = req;

    if (body?.query.includes('query GetInitialData')) {
      // eslint-disable-next-line no-param-reassign
      req.alias = 'waitForInitialDataAPI';
    }
  });
});

Cypress.Commands.add('interceptCreateUserAPI', () => {
  cy.intercept('POST', '.netlify/functions/graphql', (req) => {
    const { body } = req;

    if (body?.query.includes('mutation CreateAUser')) {
      // eslint-disable-next-line no-param-reassign
      req.alias = 'waitForCreateUserAPI';
    }
  });
});

Cypress.Commands.add('interceptHistoryAPI', () => {
  cy.intercept('POST', '.netlify/functions/graphql', (req) => {
    const { body } = req;

    if (body?.query.includes('history')) {
      // eslint-disable-next-line no-param-reassign
      req.alias = 'waitForHistoryAPI';
    }
  });
});

Cypress.Commands.add('interceptNewGameAPI', () => {
  cy.intercept('POST', '.netlify/functions/graphql', (req) => {
    const { body } = req;

    if (body?.query.includes('mutation NewGame')) {
      // eslint-disable-next-line no-param-reassign
      req.alias = 'waitForNewGameAPI';
    }
  });
});

Cypress.Commands.add('interceptStatsAPI', () => {
  cy.intercept('POST', '.netlify/functions/graphql', (req) => {
    const { body } = req;

    if (body?.query.includes('query GetStats')) {
      // eslint-disable-next-line no-param-reassign
      req.alias = 'waitForStatsAPI';
    }
  });
});

Cypress.Commands.add('mockInitialDataAPI', ({ matchesVersion = true }) => {
  cy.intercept('POST', '.netlify/functions/graphql', (req) => {
    const { body } = req;

    if (body?.query.includes('query GetInitialData')) {
      req.reply({
        data: {
          user: {
            exists: false,
            name: '',
          },
          userStats: {
            ...mockStats,
          },
          globalStats: {
            ...mockStats,
          },
          version: { matches: matchesVersion },
        },
      });
    }
  });
});

Cypress.Commands.add('mockNewGameAPI', (cards) => {
  cy.intercept('POST', '.netlify/functions/graphql', (req) => {
    const { body } = req;

    if (body?.query.includes('newGame')) {
      req.reply({
        data: {
          newGame: {
            cards,
          },
        },
      });
    }
  });
});

Cypress.Commands.add('mockSaveGameAPI', () => {
  cy.intercept('POST', '.netlify/functions/graphql', (req) => {
    const { body } = req;

    if (body?.query.includes('saveGame')) {
      req.reply({ data: { saveGame: { outcome: 'Gave Up' } } });
    }
  });
});

Cypress.Commands.add('mockCreateUserAPI', () => {
  cy.intercept('POST', '.netlify/functions/graphql', (req) => {
    const { body } = req;

    if (body?.query.includes('createUser')) {
      req.reply({
        data: { createUser: { name: 'PhilosophicalAmethystHoverfly' } },
      });
    }
  });
});

Cypress.Commands.add('mockGetUserAPI', () => {
  cy.intercept('POST', '.netlify/functions/graphql', (req) => {
    const { body } = req;

    if (body?.query.includes('query User')) {
      req.reply({
        data: { user: { exists: true, name: 'PhilosophicalAmethystHoverfly' } },
      });
    }
  });
});
