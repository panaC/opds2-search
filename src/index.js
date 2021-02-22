
const { search } = require("./search");

const fn = (req, res) => {

 switch (req.method) {
    case 'GET':
      res.status(404).json({status: "error", message: 'POST request expected'});
      break;
    case 'PUT':
      res.status(403).json({status: "error", message: 'POST request expected'});
      break;
    case 'POST':

      switch (req.get('content-type')) {
        case 'application/json':
          const body = req.body;
          const query = req.query; // not used ?

          if (typeof body?.query !== "string"){

            res.status(400).json({status: "error", message: "body.query is not a string : "});
          } else if (!Array.isArray(body?.data)) {

            res.status(400).json({status: "error", message: "body.data is not an array"});
          } else if (
              !Array.isArray(body?.field) &&
              !body.field.reduce((pv, cv) => pv && typeof cv === "string", true)
              ) {

            res.status(400).json({status: "error", message: "body.field array with some value which is not a string"});
          } else {

            body.data = body.data.map((v) => {
              for (key in v) {
                if (!(typeof v[key] === "string" || typeof v[key] === "number")) {
                  delete v[key];
                }
              }

              return v;
            }).filter((v) => {
                const keys = Object.keys(v);
                return body.field.every(v => keys.includes(v));
            });

            const resArray = search(body) || []; 
            res.status(200).json(resArray);
          }
          break;
        default:
          res.status(400).json({status: "error", message: "body content-type"});
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
      res.status(405).json({status: "error", message: "undefined method"});
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
exports.indexer = (req, res) => {

  res.set('Access-Control-Allow-Origin', '*');

  try {

    return fn(req, res);
  } catch (e) {

      res.status(500).json({status: "error", message: e.toString()});
  }
};
