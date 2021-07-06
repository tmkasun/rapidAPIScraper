import { GQL_ENDPOINT, credentials } from "./config.js";
import fetch from 'node-fetch';

export const GetProducts = async (collectionIds) => {
    const { csrfToken, _csrf, jwt_auth } = credentials;
    const variables = {
        "searchArgs": {
            "page": 1,
            "size": 24,
            "offset": 0,
            "sortBy": "installsAllTime",
            "term": "",
            "tags": [],
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
        return data.data.products.results;
    } catch (error) {
        console.error(error);
    }

}