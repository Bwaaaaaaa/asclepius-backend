const afterPredcitHandler = require('./handler.js')
routes = [
    {
        path: '/predict',
        method: 'POST',
        handler: afterPredcitHandler,
        options: {
            payload: {
              allow: 'multipart/form-data',
              multipart: true,
              maxBytes: 1000000
            }
          }
    }
]

module.exports = routes