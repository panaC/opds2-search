
const elasticlunr = require('elasticlunr-idream');

/*

  body = {

    query: STRING

    field: [STRING]


    language: string | "en", "fr", "de", ...

    data: [JSON]

    id: STRING -- id string data object keys

    raw: true/false

  }

*/
exports.search = (body = {}) => {

  const docId = typeof body?.id === 'string' ? body.id :'id';
  const index = elasticlunr(function() {
      this.setRef(docId);

      for (const keys of body.field) {

        this.addField(keys);
      }

      // this.saveDocument(false);
      });


  for (const pub of body.data) {

    index.addDoc(pub);
  }


  const res = index.search(body.query);

  console.log("QUERY: ", body.query);
  console.log("RES: ", res);

  if (body.raw) {

    return res;
  }

  const dataRes = res.map(v => {

    return body.data.find(d => v.ref === d[docId].toString());
  }).filter(v => !!v);

  return dataRes;
}
