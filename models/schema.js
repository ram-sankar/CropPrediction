var mongoose = require('mongoose');

var table_mark = mongoose.Schema({
	crop_name: {
		type: String,
		index:true
	},
	crop_mark: {
		type: String
	},
    crop_id: {
        type: String
    }
});
var mark =  mongoose.model('mark', table_mark); 



var perdiction = mongoose.Schema({
	crop_name: {
		type: String,
		index:true
	},
	crop_mark: {
		type: String
	},
    crop_id: {
        type: String
    },
    ph_mark: {
        type: String
    },
    n_mark: {
        type: String
    },
    p_mark: {
        type: String
    },
    k_mark: {
        type: String
    },
    ca_mark: {
        type: String
    },
    mg_mark: {
        type: String
    }
});
var prediction =  mongoose.model('predict', perdiction); 


module.exports = {
    mark : mark,
    prediction : prediction
}