
const { ok } = require("assert");
const { search } = require("./search");
const fetch = require('node-fetch');

const fn = async (req, res) => {

  switch (req.method) {
    case 'GET':
      // res.status(404).json({status: "error", message: 'POST request expected'});

      const { url, title, query, q, number, page, secure } = req.query;

      ok(typeof url === "string", "url param not a string");
      ok(typeof q === "string" || typeof query === "string", "query param not a string");

      const response = await fetch(url).then((res))
      const json = await response.json();

      ok(Array.isArray(json?.publications));

      console.log(json?.publications);
      console.log(query || q);
      console.log(number);
      console.log(page);

      const resSearch = search(json.publications, query || q);

      console.log("found", resSearch);

      const pubsFound = resSearch.map((v) => json.publications[v]).filter((v) => !!v);

      const _page = page ? parseInt(page, 10): 0;
      const __page = _page > 0 ? _page : 1;
      const _number = number ? parseInt(number, 10): 0;
      const __number = _number > 0 ? _number : 5;

      const startIndex = (__page - 1) * __number;
      const _pubsFound = pubsFound.slice(startIndex, startIndex + __number);

      const reqOriginalUrl = req.originalUrl.startsWith('/indexer') ? req.originalUrl : '/indexer' + req.originalUrl.slice(1);
      const originUrl = new URL(reqOriginalUrl, `http${secure ? '' : 's'}://${req.get('host')}`);
      console.log(req.get('host'), req.originalUrl);
      console.log(originUrl);

      const nextUrl = new URL(originUrl);
      nextUrl.searchParams.set("page", `${__page + 1}`);

      const previousUrl = new URL(originUrl);
      previousUrl.searchParams.set("page", `${__page - 1 > 0 ? __page - 1 : __page}`);

      const firstUrl = new URL(originUrl);
      firstUrl.searchParams.set("page", "1");

      const lastUrl = new URL(originUrl);
      lastUrl.searchParams.set("page", `${Math.round(pubsFound.length / __number) || 1}`);

      const feed = {
        metadata: {
          title: title || "opds search from " + url,
          numberOfItems: pubsFound.length,
          itemsPerPage: __number,
          currentPage: __page,
        },
        links: [
          {
            "rel": "self",
            "href": originUrl.toString(),
            "type": "application/opds+json"
          },
          {
            "rel": "next",
            "href": nextUrl.toString(),
            "type": "application/opds+json"
          },
          {
            "rel": "previous",
            "href": previousUrl.toString(),
            "type": "application/opds+json"
          },
          {
            "rel": "first",
            "href": firstUrl.toString(),
            "type": "application/opds+json"
          },
          {
            "rel": "last",
            "href": lastUrl.toString(),
            "type": "application/opds+json"
          }
        ],
        publications: _pubsFound,
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
          const { title, query, q, number, page } = req.query;

          ok(typeof q === "string" || typeof query === "string", "query param not a string");
          ok(Array.isArray(body), "body is not an array of opdsPublications");

          const resSearch = search(body, query || q);

          const pubsFound = resSearch.map((v) => json.publications[v]).filter((!!v));

          const _page = page ? parseInt(page, 10): 0;
          const __page = _page > 0 ? _page : 1;
          const _number = number ? parseInt(number, 10): 0;
          const __number = _number > 0 ? _number : 5;

          const startIndex = (__page - 1) * __number;
          const _pubsFound = pubsFound.slice(startIndex, startIndex + __number);

          const reqOriginalUrl = req.originUrl.startWith('/indexer') ? req.originUrl : '/indexer' + req.originUrl.slice(1);
          const originUrl = new URL(reqOriginalUrl, `http${secure ? '' : 's'}://${req.get('host')}`);
          console.log(req.get('host'), req.originalUrl);
          console.log(originUrl);

          const nextUrl = new URL(originUrl);
          nextUrl.searchParams.set("page", `${__page + 1}`);

          const previousUrl = new URL(originUrl);
          previousUrl.searchParams.set("page", `${__page - 1 > 0 ? __page - 1 : __page}`);

          const firstUrl = new URL(originUrl);
          firstUrl.searchParams.set("page", "1");

          const lastUrl = new URL(originUrl);
          lastUrl.searchParams.set("page", `${Math.round(pubsFound.length / __number) || 1}`);

          const feed = {
            metadata: {
              title: title || "opds search from " + url,
              numberOfItems: pubsFound.length,
              itemsPerPage: __number,
              currentPage: __page,
            },
            links: [
              {
                "rel": "self",
                "href": originUrl.toString(),
                "type": "application/opds+json"
              },
              {
                "rel": "next",
                "href": nextUrl.toString(),
                "type": "application/opds+json"
              },
              {
                "rel": "previous",
                "href": previousUrl.toString(),
                "type": "application/opds+json"
              },
              {
                "rel": "first",
                "href": firstUrl.toString(),
                "type": "application/opds+json"
              },
              {
                "rel": "last",
                "href": lastUrl.toString(),
                "type": "application/opds+json"
              }
            ],
            publications: _pubsFound,
          };

          res.status(200).json(feed);

          break;
        default:
          res.status(400).json({ status: "error", message: "body content-type" });
      }

      break;
    case 'OPTIONS':
      // Send response to OPTIONS requests
      res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
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
