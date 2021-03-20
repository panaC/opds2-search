
const { ok } = require('assert');
const elasticlunr = require('elasticlunr-idream');
require('./lunr.stemmer.support.js')(elasticlunr);
require('./lunr.fr.js')(elasticlunr);

/**
 *
 * @param {OPDSPublication[]} body 
 * @returns {number[]}
 */
exports.search = (opdspubArray, query) => {

  ok(Array.isArray(opdspubArray), "opdspub not in a array");
  ok(typeof query === "string", "query search not string type");

  const index = elasticlunr(function () {

    // this.use(elasticlunr.fr)
    this.setRef("id");

    this.addField("title");
    this.addField("author");

    // this.saveDocument(false);
  });

  for (const [i, pub] of opdspubArray.entries()) {

    const p = {
      title: pub?.metadata?.title || "",
      author: typeof pub?.metadata?.author === "string" ? pub?.metadata?.author : "",
      id: i.toString(),
    }

    console.log(p);

    index.addDoc(p);
  }

  const res = index.search(query);

  ok(Array.isArray(res), "full text search error");

  const dataRes = res.map(v => parseInt(v.ref, 10));
  return dataRes;
}
