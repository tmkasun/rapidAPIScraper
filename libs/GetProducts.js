import { GQL_ENDPOINT, credentials } from "./config.js";
import fetch from 'node-fetch';

export const GetProducts = async (collectionIds = [], isVerified = false, isOfficial = false, pagination = { page: 1, size: 24, offset: 0 }) => {
  const { csrfToken, _csrf, jwt_auth } = credentials;
  const tags = [];
  if (isVerified) {
    tags.push([
      "tagdefinition_ad8279d5-df5e-40b5-86f6-0c467a403932",
      [
        "✓"
      ]
    ]);
  }
  if (isOfficial) {
    tags.push([
      "tagdefinition_0364d241-f423-4ff4-9e3e-e51de3cdc835",
      [
        "Official"
      ]
    ]);
  }
  const { page, size, offset } = pagination;
  const variables = {
    "searchArgs": {
      page,
      size,
      offset,
      "sortBy": "installsAllTime",
      "term": "",
      tags,
      collectionIds,
      "categoryNames": [],
      "privateApisJwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpbnZpdGVkQVBJc0lEcyI6W10sImlhdCI6MTYyNTU3MTcwNX0.60ngcZqM9u-kJJTU8fi4HsHrQZ4lXjCt11VTV-dosZc"
    }
  };
  const operationName = "GetProducts"
  const query = `query GetProducts($searchArgs: SearchArguments) {
        products: apiSearchV5(searchArguments: $searchArgs) {
          total
          results {
            ...ApiInfoSearch
            __typename
          }
          __typename
        }
      }
      
      fragment ApiInfoSearch on ApiSearch {
        type: __typename
        __typename
        id
        name
        title
        description
        visibility
        slugifiedName
        pricing
        updatedAt
        category: categoryName
        thumbnail
        user: User {
          id
          username: username
          __typename
        }
        version {
          id
          tags {
            id
            status
            tagdefinition
            type
            value
            __typename
          }
          endpoints(pagingArgs: {limit: 3}) {
            ...EndpointInfo
            __typename
          }
          __typename
        }
      }
      
      fragment EndpointInfo on Endpoint {
        id
        isGraphQL
        route
        method
        name
        description
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
    return data.data.products;
  } catch (error) {
    console.error(error);
  }

}