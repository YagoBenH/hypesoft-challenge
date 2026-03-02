import Keycloak from "keycloak-js";

let client: Keycloak | null = null;

export function getKeycloakClient() {
  if (typeof window === "undefined") return null;
  if (client) return client;

  const url = process.env.NEXT_PUBLIC_KEYCLOAK_URL;
  const realm = process.env.NEXT_PUBLIC_KEYCLOAK_REALM;
  const clientId = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID;

  if (!url || !realm || !clientId) {
    throw new Error(
      "Keycloak env vars ausentes. Defina NEXT_PUBLIC_KEYCLOAK_URL, NEXT_PUBLIC_KEYCLOAK_REALM e NEXT_PUBLIC_KEYCLOAK_CLIENT_ID."
    );
  }

  client = new Keycloak({
    url,
    realm,
    clientId,
  });

  return client;
}
