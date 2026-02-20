# Hashura + Auth0 + React (Codespaces)

Acest repo pornește un prototip complet în **GitHub Codespaces**: Postgres + Hashura + React (Vite) cu Auth0.

## 1) Pornește Codespace
- Creează un repo din acest folder.
- În GitHub: **Code → Create codespace**.
- Devcontainer-ul pornește automat serviciile (Postgres + Hashura).

Porturi expuse:
- Hashura: http://localhost:8080
- React: http://localhost:5173

## 2) Configurează Auth0
În Auth0:
1. Creează un **API** (Set `Identifier` → audience).
2. Creează o **SPA Application**.
3. Configurează Allowed Callback/Logout/Origin pentru `http://localhost:5173`.
4. Adaugă rules/actions să injecteze claims Hasura.

Exemplu claims (Action):
```js
exports.onExecutePostLogin = async (event, api) => {
  const namespace = 'https://hasura.io/jwt/claims';
  api.idToken.setCustomClaim(namespace, {
    'x-hasura-default-role': 'user',
    'x-hasura-allowed-roles': ['user'],
    'x-hasura-user-id': event.user.user_id
  });
  api.accessToken.setCustomClaim(namespace, {
    'x-hasura-default-role': 'user',
    'x-hasura-allowed-roles': ['user'],
    'x-hasura-user-id': event.user.user_id
  });
};
```

## 3) Configurează variabilele
- Copiază `frontend/.env.example` în `frontend/.env` și completează:
```
VITE_AUTH0_DOMAIN=...
VITE_AUTH0_CLIENT_ID=...
VITE_AUTH0_AUDIENCE=...
VITE_HASURA_GRAPHQL_URL=http://localhost:8080/v1/graphql
```

Actualizează și JWT secret în `.devcontainer/docker-compose.yml`:
```json
{"type":"RS256","jwk_url":"https://YOUR_DOMAIN/.well-known/jwks.json","audience":"YOUR_API_AUDIENCE","issuer":"https://YOUR_DOMAIN/"}
```

## 4) Pornește frontendul
În terminal:
```bash
npm --prefix frontend install
npm --prefix frontend run dev
```

Accesează `http://localhost:5173`.

## 5) Hashura Console
- http://localhost:8080
- Admin Secret: `devsecret`

Creează 1-2 tabele în Postgres din console și setează permisiuni pe rolul `user`.

---

Dacă vrei, îți adaug și un exemplu de schema + migrations în repo.
