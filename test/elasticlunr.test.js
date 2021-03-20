const elasticlunr = require('elasticlunr-idream');
const fs = require('fs');
const assert = require('assert').strict;
const search = require('../src/search');

const data = fs.readFileSync("./opdsfeed.json", "utf8");

const json = JSON.parse(data);

const publication = json?.publications

assert.deepStrictEqual(Array.isArray(publication), true);

const res = search.search(publication, "befor");

console.log(res);

const pubFound = res.map(i => publication[i]).filter(v => !!v);

console.log(pubFound);

// const publicationMetadata = publication
//   .map((v) => v?.metadata)
//   .filter((v) => typeof v === "object" && v["@type"] === "http://schema.org/Book")
//   .map((v) => ({
//     title: v.title,
//     id: v.identifier,
//     description: v.description,
//     author: v.author[0]?.name || "",
//   }));

// fs.writeFileSync("publication.json", JSON.stringify(publicationMetadata));

// console.info("nb Publication : ", publicationMetadata.length);

// var index = elasticlunr(function () {
//     this.setRef('id');// compulsory

//     this.addField('title');
//     this.addField('description');
//     this.addField('author');

//     this.saveDocument(false);
// });


// for (const pub of publicationMetadata) {

//   console.info(pub.title);

//   index.addDoc(pub);
// }

// const query = "before";

// const res = index.search(query);

// console.log("RESULT query : ", query);
// console.log(res);
