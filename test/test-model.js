"use strict";

module.exports = class TestModel {
    constructor(source) {

        this.number = 0;
        this.string = "";
        this.date = new Date();
        this.object = {};
        this.array = [];


        this._stamp = "";
        this._type = "test-type";
        this._version = "1.0.0";
        this._active = true;
        this._deleted = false;
        this._createdBy = "";
        this._createdDate = new Date(1900, 1, 1);
        this._createAgent = "";
        this._updatedBy = "";
        this._updatedDate = new Date(1900, 1, 1);
        this._updateAgent = "";
        this.copy(source);
    } 
    
    stamp(actor, agent) {
        var now = new Date();

        this._createdBy = this._createdBy || actor;
        this._createdDate = !this._createdDate ? now : this._createdDate;
        this._createAgent = this._createAgent || agent;

        var ticks = ((now.getTime() * 10000) + 621355968000000000);

        this._stamp = ticks.toString(16);
        this._updatedBy = actor;
        this._updatedDate = now;
        this._updateAgent = agent;
    }

    copy(source) {
        this._id = null;
        var _source = source || {};
        var properties = Object.getOwnPropertyNames(this);
        for (var prop of properties) {
            this[prop] = _source[prop] || this[prop];
        }
        this.cleanUp();
    }

    cleanUp() {
        if (!this._id || this._id === "") {
            delete(this._id);
        }
    }
};
