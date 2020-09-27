//mongoos for connecting mongoDB
const mongoose = require('mongoose')
//keys for db connection string
//debugger for logging console msg in dev environment
const debug = require('debug')('app:db')

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
// module.exports = mongoose.connect(keys.mongoURI, { useNewUrlParser: true})
module.exports = mongoose.connect("mongodb+srv://abdul:221bbakerstreet@chatdb-izw9y.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true})

    .then(() => debug("Connected to MongoDB Successfully"))
    .catch(err => debug(err)); 



    