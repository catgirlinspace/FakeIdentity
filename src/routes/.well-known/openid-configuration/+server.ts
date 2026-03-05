import type {RequestHandler} from '@sveltejs/kit'

export const GET: RequestHandler = ({url}) => {
	const issuer = url.origin;

	return new Response(JSON.stringify({
		issuer,
		authorization_endpoint: `${issuer}/oidc/authorize`,
		token_endpoint: `${issuer}/oidc/token`,
		userinfo_endpoint: `${issuer}/oidc/userinfo`,
		jwks_uri: `${issuer}/oidc/jwks`,
		scopes_supported: ['openid', 'profile'],
		response_types_supported: ['code'],
		grant_types_supported: ['authorization_code'],
		subject_types_supported: ['public'],
		id_token_signing_alg_values_supported: ['RS256'],
		token_endpoint_auth_methods_supported: ['client_secret_post', 'client_secret_basic'],
		claims_supported: ['sub', 'name', 'preferred_username'],
	}), {headers: {'Content-Type': 'application/json'}});
};
