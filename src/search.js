
const { ok } = require('assert');
const lunr = require("lunr");
require('./lunr.stemmer.support.js')(lunr);
require('./lunr.fr.js')(lunr);

/**
 *
 * @param {OPDSPublication[]} body 
 * @returns {number[]}
 */
exports.search = (opdspubArray, query) => {

  ok(Array.isArray(opdspubArray), "opdspub not in a array");
  ok(typeof query === "string", "query search not string type");

  const index = lunr(function () {

    this.use(lunr.fr);
    // this.setRef("id");

    this.field("title", { boost: 10 });
    this.field("author");

    // this.saveDocument(false);

    for (const [i, pub] of opdspubArray.entries()) {

      const p = {
        title: pub?.metadata?.title || "",
        author: typeof pub?.metadata?.author === "string" ? pub?.metadata?.author : "",
        id: i.toString(),
      }

      // console.log(p);

      this.add(p);
    }
  });


  const res = index.search(query);

  ok(Array.isArray(res), "full text search error");

  const dataRes = res.map(v => parseInt(v.ref, 10));
  return dataRes;
}
