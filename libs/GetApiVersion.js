import { GQL_ENDPOINT, credentials } from "./config.js";
import fetch from 'node-fetch';

export const GetApiVersion = async (versionId) => {
  const { csrfToken, _csrf, jwt_auth } = credentials;
  const variables = {
    versionId
  };
  const operationName = "GetApiVersion"
  const query = `query GetApiVersion($versionId: ID!) {
      getApiVersion(versionId: $versionId) {
        id
        ...PublicDns
        __typename
      }
    }
    
    fragment PublicDns on ApiVersion {
      publicdns {
        proxyMode
        address
        current
        id
        __typename
      }
      __typename
    }`;
  try {
    const data = await fetch(GQL_ENDPOINT, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "csrf-token": csrfToken,
        "cookie": `_csrf=${_csrf}; jwt_auth=${jwt_auth};`
      },
      body: JSON.stringify({
        operationName,
        query,
        variables,
      }),
    }).then(r => r.json());
    return data.data.getApiVersion;
  } catch (error) {
    console.error(error);
  }

}