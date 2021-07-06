import { GQL_ENDPOINT, credentials } from "./config.js";
import fetch from 'node-fetch';

export const GetCollectionBySlug = async (slug) => {
  const { csrfToken, _csrf, jwt_auth } = credentials;
  const variables = {
    slug,
    "id": slug,
    "productsLimit": 3
  };
  const operationName = "GetCollectionBySlug"
  const query = `query GetCollectionBySlug($slug: String!, $productsLimit: Int!) {
      collection: collectionBySlugifiedKeyV3(slugifiedKey: $slug) {
        id
        title
        thumbnail
        shortDescription
        longDescription
        slugifiedKey
        orderCollectionItems
        collectionType: collection_type
        post {
          id
          link
          title
          thumbnail
          image
          __typename
        }
        apis(apisSkip: 0, apisLimit: $productsLimit) {
          ... on Api {
            name
            id
            __typename
          }
          ... on CollectionSpotlight {
            name: title
            id
            __typename
          }
          __typename
        }
        __typename
      }
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
    return data.data.collection;
  } catch (error) {
    console.error(error);
  }

}