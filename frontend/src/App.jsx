import React, { useMemo, useState } from 'react'
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink, gql, useQuery } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { useAuth0 } from '@auth0/auth0-react'

const QUERY = gql`
  query MyQuery {
    healthcheck: __typename
  }
`

function QueryBlock() {
  const { data, loading, error } = useQuery(QUERY)
  if (loading) return <p>Loading…</p>
  if (error) return <pre>{error.message}</pre>
  return <pre>{JSON.stringify(data, null, 2)}</pre>
}

export default function App() {
  const {
    loginWithRedirect,
    logout,
    isAuthenticated,
    isLoading,
    getAccessTokenSilently,
    getIdTokenClaims,
    user
  } = useAuth0()
  const [claims, setClaims] = useState(null)
  const [claimsError, setClaimsError] = useState(null)

  const client = useMemo(() => {
    const httpLink = new HttpLink({ uri: import.meta.env.VITE_HASURA_GRAPHQL_URL })
    const authLink = setContext(async (_, { headers }) => {
      let token = ''
      try {
        token = await getAccessTokenSilently()
      } catch (e) {
        // Not logged in yet
      }
      return {
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : ''
        }
      }
    })

    return new ApolloClient({
      link: authLink.concat(httpLink),
      cache: new InMemoryCache()
    })
  }, [getAccessTokenSilently])

  return (
    <ApolloProvider client={client}>
      <div style={{ fontFamily: 'system-ui', padding: 24 }}>
        <h1>Hashura + Auth0 Prototype</h1>
        {isLoading ? (
          <p>Loading auth…</p>
        ) : isAuthenticated ? (
          <>
            <p>Logged in as {user?.email || user?.name}</p>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
                Log out
              </button>
              <button
                onClick={async () => {
                  setClaimsError(null)
                  try {
                    const c = await getIdTokenClaims()
                    setClaims(c || null)
                  } catch (e) {
                    setClaims(null)
                    setClaimsError(e?.message || String(e))
                  }
                }}
              >
                Show token claims
              </button>
            </div>
            {claimsError && <pre style={{ color: 'crimson' }}>{claimsError}</pre>}
            {claims && <pre>{JSON.stringify(claims, null, 2)}</pre>}
            <h3>GraphQL test</h3>
            <QueryBlock />
          </>
        ) : (
          <button onClick={() => loginWithRedirect()}>Log in</button>
        )}
      </div>
    </ApolloProvider>
  )
}
