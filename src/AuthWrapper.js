import React from 'react';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

const client = new ApolloClient({
  uri: 'https://example-auth.herokuapp.com/graphql' //your graphql back-end endpoint here
});

const AuthWrapper = WrappedComponent => {
  class Auth extends React.Component {
    render () {
      return (
        <ApolloProvider client={client}>
          <WrappedComponent {...this.props} />
        </ApolloProvider>
      )
    }
  }

  return Auth
}

export default AuthWrapper
