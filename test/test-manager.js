"use strict";

var ObjectId = require("mongodb").ObjectId;
require("mongodb-toolkit");
var BaseManager = require("../src/base-manager");
var ValidationError = require("../src/base-manager");
var Project = require("./test-model");

const collectionName = "module-toolkit-test";
module.exports = class TestManager extends BaseManager {
    constructor(db, user) {
        super(db, user);
        this.collection = this.db.use(collectionName);
    }

    // _createIndexes() {
    //     var dateIndex = {
    //         name: `ix_${collectionName}__updatedDate`,
    //         key: {
    //             _updatedDate: -1
    //         }
    //     };

    //     return this.collection.createIndexes([dateIndex]);
    // }

    // _getQuery(_paging) {
    //     var basicFilter = {
    //             _deleted: false
    //         },
    //         keywordFilter = {};

    //     var query = {};

    //     if (_paging.keyword) {
    //         var regex = new RegExp(_paging.keyword, "i");
    //         var filterString = {
    //             "string": {
    //                 "$regex": regex
    //             }
    //         };
    //         keywordFilter = {
    //             "$or": [filterString]
    //         };

    //     }
    //     query = {
    //         "$and": [basicFilter, _paging.filter || {}, keywordFilter]
    //     };
    //     return query;
    // }

    // _validate(project) { 
    //     var valid = new Project(project);
    //     valid.stamp("tester", "manager");
    //     return Promise.resolve(valid);
    // }
};
