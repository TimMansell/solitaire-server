import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';

// eslint-disable-next-line import/prefer-default-export
export const setupGraphQl = ({ app }) => {
  // Construct a schema, using GraphQL schema language
  const schema = buildSchema(`
type Query {
  hello: String
}
`);

  // The root provides a resolver function for each API endpoint
  const root = {
    hello: () => {
      return 'Hello world!';
    },
  };

  app.use(
    '/graphql',
    graphqlHTTP({
      schema,
      rootValue: root,
      graphiql: true,
    })
  );
};
