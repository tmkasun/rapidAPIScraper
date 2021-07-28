#!/usr/bin/env node
import { GetApiOpenAPISpecs, GetProducts, extractSlugs, GetCollectionBySlug, GetApiVersion } from "./libs/index.js";
import { randomInt } from './libs/utils.js'
import fs from 'fs'

const OFFICIAL_ONLY = true;
const slugs = await extractSlugs();

const numberOfSlugs = OFFICIAL_ONLY ? 1 : 50;
for (let i of Array(numberOfSlugs).keys()) {
    const randomIndex = randomInt(0, slugs.length);
    const slugCollection = await GetCollectionBySlug(slugs[randomIndex]);
    const { id: collectionID, title } = slugCollection;
    const dir = OFFICIAL_ONLY ? './data/official' : `./data/${title}`
    console.debug(`Creating ${dir} directory`)
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    const productsList = OFFICIAL_ONLY ? await GetProducts(OFFICIAL_ONLY) : await GetProducts(OFFICIAL_ONLY, [collectionID]);
    for (const apiProduct of productsList) {
        const { name, id, version: { id: versionId, tags } } = apiProduct;
        const { publicdns } = await GetApiVersion(versionId);
        const [publicDNS1] = publicdns;
        console.log(`Fectching ${name} API prodcut`)
        const dir = OFFICIAL_ONLY ? `./data/official/${name}` : `./data/${title}/${name}`
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
    }
}