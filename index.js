#!/usr/bin/env node
import { GetApiOpenAPISpecs, GetProducts, extractSlugs, GetCollectionBySlug } from "./libs/index.js";
import { randomInt } from './libs/utils.js'
import fs from 'fs'


const slugs = await extractSlugs();

const numberOfSlugs = 10;
for (let i of Array(numberOfSlugs).keys()) {
    const randomIndex = randomInt(0, slugs.length);
    const slugCollection = await GetCollectionBySlug(slugs[randomIndex]);
    const { id: collectionID, title } = slugCollection;
    const dir = `./data/${title}`
    console.debug(`Creating ${dir} directory`)
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    const productsList = await GetProducts([collectionID]);
    for (const apiProduct of productsList) {
        const { name, id } = apiProduct;
        console.log(`Fectching ${name} API prodcut`)
        const dir = `./data/${title}/${name}`
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        fs.writeFile(`${dir}/${name}.json`, JSON.stringify(apiProduct, null, 4), (err) => {
            if (err) throw err;
            console.log(`The ${name}.json API Meta has been saved!`);
        });
        const productOASDefinition = await GetApiOpenAPISpecs(apiProduct.id);
        fs.writeFile(`${dir}/${name}-OAS.json`, JSON.stringify(productOASDefinition, null, 4), (err) => {
            if (err) throw err;
            console.log(`The ${name}.json API OAS definition has been saved!`);
        });
    }
}