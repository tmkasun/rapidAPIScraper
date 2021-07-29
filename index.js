#!/usr/bin/env node
import { GetApiOpenAPISpecs, GetProducts, extractSlugs, GetCollectionBySlug, GetApiVersion } from "./libs/index.js";
import { randomInt } from './libs/utils.js'
import fs from 'fs'

const VERIFIED_ONLY = true;
const OFFICIAL_ONLY = false;
const slugs = await extractSlugs();

const numberOfSlugs = OFFICIAL_ONLY ? 1 : 50;
for (let i of Array(numberOfSlugs).keys()) {
    const randomIndex = randomInt(0, slugs.length);
    const slugCollection = await GetCollectionBySlug(slugs[randomIndex]);
    const { id: collectionID, title } = slugCollection;
    let dir = `./data/${title}`;

    if (VERIFIED_ONLY) {
        dir = './data/verified'
    } else if (OFFICIAL_ONLY) {
        dir = './data/official';
    }
    console.debug(`Creating ${dir} directory`)
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    let result;
    let pagination = { page: 1, size: 24, offset: 0 };
    if (VERIFIED_ONLY || OFFICIAL_ONLY) {
        result = await GetProducts([], VERIFIED_ONLY, OFFICIAL_ONLY, pagination);
    }
    else {
        result = await GetProducts([collectionID]);
    }
    let { results: productsList, total } = result;
    let currentTotal = 0;
    let hasNextPage = currentTotal < total;
    while (hasNextPage) {
        let pageCount = 0;
        for (const apiProduct of productsList) {
            pageCount += 1;
            currentTotal += 1;
            const { name, id, version: { id: versionId, tags } } = apiProduct;
            const { publicdns } = await GetApiVersion(versionId);
            const [publicDNS1] = publicdns;
            console.log(`Fectching ${name} API prodcut`)
            let dir = `./data/${title}/${name}`;
            if (OFFICIAL_ONLY) {
                dir = `./data/official/${name}`;
            } else if (VERIFIED_ONLY) {
                dir = `./data/verified/${name}`;
            }

            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
            fs.writeFile(`${dir}/${name}.json`, JSON.stringify(apiProduct, null, 4), (err) => {
                if (err) throw err;
                console.log(`The ${name}.json API Meta has been saved!`);
            });
            const productOASDefinition = await GetApiOpenAPISpecs(apiProduct.id);
            productOASDefinition.servers = productOASDefinition.servers.map(
                ({ url, ...rest }) => Object.assign({ url: `https://${publicDNS1.address}${url}` }, rest)
            )
            fs.writeFile(`${dir}/${name}-OAS.json`, JSON.stringify(productOASDefinition, null, 4), (err) => {
                if (err) throw err;
                console.log(`The ${name}.json API OAS definition has been saved!`);
            });
            console.warn(`Saved ${pageCount} APIs out of ${productsList.length} in ${pagination.page} page with total ${currentTotal}/${total} `);
        }
        if (VERIFIED_ONLY) {
            pagination.page = pagination.page + 1;
            const response = await GetProducts([], VERIFIED_ONLY, OFFICIAL_ONLY, pagination);
            productsList = response.results;
            total = response.total;
            hasNextPage = currentTotal < total;
        } else {
            hasNextPage = false; // Do not iterate
        }
    }

}