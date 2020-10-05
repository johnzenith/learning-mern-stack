const DB_PWD = 'Enter password here';
const DB_NAME = 'Enter DB name here';

export default {
    MongoURI: `mongodb+srv://dev-atlas-user-1:${DB_PWD}@test-cluster-1.2mckq.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`,
    MongoDB_Options: {
        useNewUrlParser   : true,
        useUnifiedTopology: true
    }
};