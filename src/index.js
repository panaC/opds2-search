
const { ok } = require("assert");
const { search } = require("./search");
const fetch = require('node-fetch');

const fn = async (req, res) => {

  switch (req.method) {
    case 'GET':
      // res.status(404).json({status: "error", message: 'POST request expected'});

      const { url, title, query, q } = req.query;

      ok(typeof url === "string", "url param not a string");
      ok(typeof q === "string" || typeof query === "string", "query param not a string");

      const response = await fetch(url).then((res))
      const json = await response.json();

      ok(Array.isArray(json?.publications));

      console.log(json?.publications);
      console.log(query || q);

      const resSearch = search(json.publications, query || q);

      console.log("found", resSearch);

      const pubsFound = resSearch.map((v) => json.publications[v]).filter((v) => !!v);

      const feed = {
        metadata: {
          title: title || "opds search from " + url,
        },
        publications: pubsFound,
      };

      res.status(200).json(feed);


      break;
    case 'PUT':
      res.status(403).json({ status: "error", message: 'POST request expected' });
      break;
    case 'POST':

      switch (req.get('content-type')) {
        case 'application/json':
          const body = req.body;
          const { title, query, q } = req.query;

          ok(typeof q === "string" || typeof query === "string", "query param not a string");
          ok(Array.isArray(body), "body is not an array of opdsPublications");

          const resSearch = search(body, query || q);

          const pubsFound = resSearch.map((v) => json.publications[v]).filter((!!v));

          const feed = {
            metadata: {
              title: title || "opds search from " + url,
            },
            publications: pubsFound,
          };

          res.status(200).json(feed);

          break;
        default:
          res.status(400).json({ status: "error", message: "body content-type" });
      }

      break;
    case 'OPTIONS':
      // Send response to OPTIONS requests
      res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
      res.set('Access-Control-Allow-Headers', 'Content-Type');
      res.set('Access-Control-Max-Age', '3600');
      res.status(204).json({});
      break;
    default:
      res.status(405).json({ status: "error", message: "undefined method" });
      break;
  }

}


/**
 * HTTP Cloud Function.
 *
 * @param {Object} req Cloud Function request context.
 *                     More info: https://expressjs.com/en/api.html#req
 * @param {Object} res Cloud Function response context.
 *                     More info: https://expressjs.com/en/api.html#res
 */
exports.indexer = async (req, res) => {

  res.set('Access-Control-Allow-Origin', '*');

  try {

    return await fn(req, res);
  } catch (e) {

    console.log(e);

    res.status(500).json({ status: "error", message: e.toString() });
  }
};
