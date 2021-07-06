import { GQL_ENDPOINT, credentials } from "./config.js";
import fetch from 'node-fetch';

export const GetApiOpenAPISpecs = async (id) => {
    const { csrfToken, _csrf, jwt_auth } = credentials;
    const variables = { id };
    const operationName = "GetApiOpenAPISpecs"
    const query = `query GetApiOpenAPISpecs($id: ID!) { 
        openapi: getOpenApiSpecByApiId(apiId: $id)
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
        return data.data.openapi;
    } catch (error) {
        console.error(error);
    }

}