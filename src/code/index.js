const cache = `{
  ROOT_QUERY: {
    articles: {
      0: 'Article:1',
      1: 'Article:2',
    },
  },
  'Article:1': {
    id: 1,
    title: 'Demystifying the Apollo cache',
    /* ... */
  },
  'Article:2': {
    id: 2,
    title: 'React Apollo v2',
    /* ... */
  },
};`;

const articles = `{
  data: {
    articles: [
      {
        id: 1,
        title: 'Demystifying the Apollo cache',
        author: 'Peggy Rayzis',
        __typename: 'Article',
      },
      {
        id: 2,
        title: 'React Apollo v2',
        author: 'James Baxley',
        __typename: 'Article',
      },
    ],
  },
};`;

const rest = `const restLink = new RestLink({uri: 'https://swapi.co/api/'});

const GET_LUKE = gql\`
  query luke {
    person @rest(type: "Person", path: "people/1/") {
      name
    }
  }
\`;`;

const typeDefs = `const typeDefs = \`
  type Todo {
    id: String
    message: String!
  }

  type Query {
    todo(id: String!): Todo
  }
\`;

const stateLink = withClientState({
  typeDefs, resolvers, defaults, cache
});`;

const resolvers = `const resolvers = {
  Mutation: {
    toggleTodo: (_, variables, { cache }) => {
      const id = 'TodoItem:' + variables.id;
      const fragment = gql\`
        fragment completeTodo on TodoItem {
          completed
        }
      \`;
      const todo = cache.readFragment({ fragment, id });
      const data = { ...todo, completed: !todo.completed };
      cache.writeData({ id, data });
      return null;
    },
  },
};`;

const stateLink = `const stateLink = withClientState({
  cache,
  defaults: { visibilityFilter: 'SHOW_ALL' },
  resolvers: {
    Mutation: {
      visibilityFilter: (_, { filter }, { cache }) => {
        cache.writeData({
          data: { visibilityFilter: filter }
        });
        return null;
      },
    },
  },
});`;

const actions = `export function fetchPosts() {
  return { type: 'FETCH_POSTS_LOADING', loading: true };
}

export function fetchPostsSuccess(payload) {
  return { type: 'FETCH_POSTS_SUCCESS', payload };
}

export function fetchPostsError(error) {
  return { type: 'FETCH_POSTS_ERROR', error };
}`;

const postsQuery = `const FETCH_POSTS = gql\`
  query fetchPosts {
    posts {
      id
      title
      author
    }
  }
\`;`;

const combinedQuery = `const combinedQuery = gql\`
  query list {
    list(name: "my list") {
      items {
        id
        name
        isDone
        isSelected @client
      }
    }
  }
\`;`;

const posts = `const Posts = () => (
  <Query query={FETCH_POSTS}>
    {result => {
      if (result.loading) return <ActivityIndicator />;
      if (result.error) return <Error error={result.error} />;

      const { data: { posts } } = result;
      return posts.map(post => (
        <Post key={post.id} post={post} />
      ));
    }}
  </Query>
);`;

const code = {
  graphql: `const GET_SANDWICH = gql\`
  query {
    sandwich {
      bread {
        baguette
      }
      meat {
        turkey
      }
      toppings {
        avocado
        tomato
      }
    }
  }
\`;`,
  sandwichQuery: `const MyFavoriteSandwich = () => (
  <Query query={GET_SANDWICH}>
    {({ data: { sandwich } }) => (
      <Sandwich
        bread={sandwich.bread}
        meat={sandwich.meat}
        toppings={sandwich.toppings}
      />
    )}
  </Query>
);`,
  setup: `import ApolloClient from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink(),
});`,
  persist: `const cache = new InMemoryCache();

persistCache({
  cache,
  storage: AsyncStorage,
  trigger: 'background',
});`,
  schema: `type Sandwich {
  bread: Bread
  meat: Meat
  toppings: Toppings
}

type Bread {
  baguette: String
  ciabatta: String
  multigrain: String
}
`,
  cache,
  articles,
  rest,
  typeDefs,
  stateLink,
  actions,
  postsQuery,
  posts,
  resolvers,
  combinedQuery,
};

export default code;
