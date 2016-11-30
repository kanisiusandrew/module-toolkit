function test(name, path) {
    describe(name, function() {
        require(path);
    })
}


describe('#academy-module', function(done) {
    this.timeout(2 * 60000); 
    test('@base-manager', './base-manager-test');

});
