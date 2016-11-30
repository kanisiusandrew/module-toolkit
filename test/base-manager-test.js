var TestManager = require("./test-manager");
var instanceManager = null;
require("should");

function getData() {
    var TestModel = require("./test-model");
    var testModel = new TestModel({
        number: 10,
        string: "some string",
        date: new Date(),
        object: {},
        array: [1, 2, 3],
        _createdBy: "JOHN",
        _createdDate: new Date(1970, 1, 1),
        _createAgent: "UNIT-TEST"
    });
    return Promise.resolve(testModel);
}

function getDbConnection() {
    var MongoClient = require("mongodb").MongoClient;
    var url = process.env.DB_CONNECTIONSTRING;
    return MongoClient.connect(url);
}

function instantiateManager(db) {
    return Promise.resolve(new TestManager(db, {
        username: "unit-test"
    }));
}

before("#00. connect db", function(done) {
    getDbConnection()
        .then(instantiateManager)
        .then((manager) => {
            instanceManager = manager;
            done();
        })
        .catch((e) => {
            done(e);
        });
});

var createdId;
it("#01. should success when create new data", function(done) {
    var data = getData();
    instanceManager.create(data)
        .then(id => {
            id.should.be.Object();
            createdId = id;
            done();
        })
        .catch(e => {
            done(e);
        });
});

var createdData;
it(`#02. should success when get created data with id`, function(done) {
    instanceManager.getSingleByQuery({
            _id: createdId
        })
        .then(data => {
            // validate.product(data);
            data.should.instanceof(Object);
            createdData = data;
            done();
        })
        .catch(e => {
            done(e);
        });
});


it(`#03. should success when update created data`, function(done) {

    createdData.string += "[updated]";

    instanceManager.update(createdData)
        .then(id => {
            createdId.toString().should.equal(id.toString());
            done();
        })
        .catch(e => {
            done(e);
        });
});

it(`#04. should success when get updated data with id`, function(done) {
    instanceManager.getSingleByQuery({
            _id: createdId
        })
        .then(data => {
            data.string.should.equal(createdData.string);
            done();
        })
        .catch(e => {
            done(e);
        });
});

it("#05. should success when read data", function(done) {
    instanceManager.read()
        .then(documents => {
            //process documents
            documents.should.have.property("data");
            documents.data.should.be.instanceof(Array);
            done();
        })
        .catch(e => {
            done(e);
        });
});

it(`#06. should success when delete data`, function(done) {
    instanceManager.delete(createdData)
        .then(id => {
            createdId.toString().should.equal(id.toString());
            done();
        })
        .catch(e => {
            done(e);
        });
});

it(`#07. should _deleted=true`, function(done) {
    instanceManager.getSingleByQuery({
            _id: createdId
        })
        .then(data => {
            // validate.product(data);
            data._deleted.should.be.Boolean();
            data._deleted.should.equal(true);
            done();
        })
        .catch(e => {
            done(e);
        });
});

it(`#08. should success when destroyed`, function(done) {
    instanceManager.destroy(createdId)
        .then(result => {
            // validate.product(data);
            result.should.be.Boolean();
            result.should.equal(true);
            done();
        })
        .catch(e => {
            done(e);
        });
});