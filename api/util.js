module.exports.handleError = function (err) {
    console.error("Error: "+err);
    return 1;
};

module.exports.transform = {
    json: function(key) {
        return {
            get: function () {
                try {
                    return JSON.parse(this.getDataValue(key));
                } catch (e) {
                    console.error("transforms.json: "+e);
                }
                return null;
            },
            set: function (v) {
                //FIXME: Protects against sequelizer calling the setter multiple times
                if (typeof v == 'string') {
                    return this.setDataValue(key, v);
                }

                return this.setDataValue(key, JSON.stringify(v));
            },
            //FIXME: Necessary due to sequelizer not calling getter() for serialization
            toJSON: function () {
                var json = this.values;
                json[key] = JSON.parse(json[key]);
                return json;
            }
        };
    }
};
