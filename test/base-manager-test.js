var TestManager = require("./test-manager");
var Project = require("./test-model");
var instanceManager = null;
var should = require("should");

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

before("#000. connect db", function(done) {
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

it("#01A. should error when create new data without overriding _validate()", function(done) {
    var data = {};
    instanceManager.create(data)
        .then(id => {
            done("should error when manager does not override _validate()");
        })
        .catch(e => {
            e.message.should.equal("_validate(data) not implemented");
            done();
        });
});

it("#01B. should error when read() without overriding _getQuery()", function(done) {
    instanceManager.read({})
        .then(id => {
            done("should error when manager does not override _getQuery(paging)");
        })
        .catch(e => {
            e.message.should.equal("_getQuery(paging) not implemented");
            done();
        });
});

it("#00A. override _getQuery(paging) & _validate(data)", function(done) {

    instanceManager._getQuery = (_paging) => {
        var basicFilter = {
                _deleted: false
            },
            keywordFilter = {};

        var query = {};

        if (_paging.keyword) {
            var regex = new RegExp(_paging.keyword, "i");
            var filterString = {
                "string": {
                    "$regex": regex
                }
            };
            keywordFilter = {
                "$or": [filterString]
            };

        }
        query = {
            "$and": [basicFilter, _paging.filter || {}, keywordFilter]
        };
        return query;
    };

    instanceManager._validate = (project) => {
        var valid = new Project(project);
        valid.stamp("tester", "manager");
        return Promise.resolve(valid);
    };
    done();
});

it("#01C. should success read() without overriding _createIndexes()", function(done) {
    instanceManager.read({})
        .then(results => {
            results.should.have.property("data");
            results.data.should.instanceof(Array);
            results.should.have.property("count");
            results.count.should.instanceof(Number);
            results.should.have.property("size");
            results.size.should.instanceof(Number);
            results.should.have.property("total");
            results.total.should.instanceof(Number);
            results.should.have.property("page");
            results.page.should.instanceof(Number);
            results.should.have.property("order");
            results.order.should.instanceof(Object);
            results.should.have.property("filter");
            should.equal(results.filter, undefined);
            done();
        })
        .catch(e => {
            done(e);
        });
});


it("#00B. override _createIndexes()", function(done) {

    instanceManager._createIndexes = function() {
        var dateIndex = {
            name: `ix_${"module-toolkit-test"}__updatedDate`,
            key: {
                _updatedDate: -1
            }
        };
        return this.collection.createIndexes([dateIndex]);
    }.bind(instanceManager);
    done();
});


var createdId;
it("#02A. should success when create new data", function(done) {
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
it(`#03A. should success when get created data with getSingleById(id)`, function(done) {
    instanceManager.getSingleById(createdId)
        .then(data => {
            data.should.instanceof(Object);
            createdData = data;
            done();
        })
        .catch(e => {
            done(e);
        });
});

it(`#03B. should success when get created data with getSingleByIdOrDefault(id)`, function(done) {
    instanceManager.getSingleByIdOrDefault(createdId)
        .then(data => {
            data.should.instanceof(Object);
            createdData = data;
            done();
        })
        .catch(e => {
            done(e);
        });
});

it(`#03C. should success when get created data with getSingleByQuery(id)`, function(done) {
    instanceManager.getSingleByQuery({
            _id: createdId
        })
        .then(data => {
            data.should.instanceof(Object);
            createdData = data;
            done();
        })
        .catch(e => {
            done(e);
        });
});

it(`#03D. should success when get created data with getSingleByQueryOrDefault(id)`, function(done) {
    instanceManager.getSingleByQueryOrDefault({
            _id: createdId
        })
        .then(data => {
            data.should.instanceof(Object);
            createdData = data;
            done();
        })
        .catch(e => {
            done(e);
        });
});


it(`#04A. should success when update created data`, function(done) {

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

it(`#05A. should success when get updated data with getSingleById(id)`, function(done) {
    instanceManager.getSingleById(createdId)
        .then(data => {
            data.string.should.equal(createdData.string);
            done();
        })
        .catch(e => {
            done(e);
        });
});

it(`#05B. should success when get updated data with getSingleByIdOrDefault(id)`, function(done) {
    instanceManager.getSingleByIdOrDefault(createdId)
        .then(data => {
            data.string.should.equal(createdData.string);
            done();
        })
        .catch(e => {
            done(e);
        });
});

it(`#05C. should success when get updated data with getSingleByQuery(id)`, function(done) {
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

it(`#05D. should success when get updated data with getSingleByQueryOrDefault(id)`, function(done) {
    instanceManager.getSingleByQueryOrDefault({
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

it("#06A. should success when read data", function(done) {
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

it(`#07A. should success when delete data`, function(done) {
    instanceManager.delete(createdData)
        .then(id => {
            createdId.toString().should.equal(id.toString());
            done();
        })
        .catch(e => {
            done(e);
        });
});

it(`#07B. should _deleted=true`, function(done) {
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

it(`#08A. should success when destroyed`, function(done) {
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
