# Hashura BaaS Prototype

Pornire rapidă pentru un setup local Hasura + Postgres, cu config pregătit pentru Auth0/JWT.

## Cerințe
- Docker Engine
- Docker Compose v2 (sau binarul v2)
- Git

## 1) Clonează & pornește
```bash
git clone <your-repo-url>
cd hashura-baas-prototype

docker compose up -d
# Dacă folosești binarul v2 separat:
# /usr/local/bin/docker-compose up -d
```

## 2) Deschide Hasura Console
- http://localhost:8081
- **Admin secret:** `adminsecret`

## 3) (Opțional) Configurează Auth0 JWT
Actualizează `HASURA_GRAPHQL_JWT_SECRET` în `docker-compose.yml`:
```json
{"type":"RS256","jwk_url":"https://YOUR_DOMAIN/.well-known/jwks.json","issuer":"https://YOUR_DOMAIN/"}
```

### Auth0 Action (claims)
```js
exports.onExecutePostLogin = async (event, api) => {
  const ns = 'https://hasura.io/jwt/claims';
  const claims = {
    'x-hasura-default-role': 'user',
    'x-hasura-allowed-roles': ['user'],
    'x-hasura-user-id': event.user.user_id
  };
  api.idToken.setCustomClaim(ns, claims);
  api.accessToken.setCustomClaim(ns, claims);
};
```

## 4) Baza de date + Permisiuni
- Creează tabelele în tab‑ul **Data**.
- Setează permisiuni pentru rolul `user` folosind `X-Hasura-User-Id`.

## Comenzi utile
```bash
# Oprire
 docker compose down

# Loguri
 docker compose logs -f hasura
```

---
Dacă vrei un exemplu de schemă + migrations, spune-mi ce entități îți trebuie.
