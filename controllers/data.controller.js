const Data = require('../models/data.model.js')

module.exports.readAll = async function(req, res) {
	var Datas = await Data.find()  // tim trong database neu co du lieu thi render + Datas
	res.json(Datas)
};

module.exports.write = async function(req, res) {
	const data = req.body
    const result = await Data.collection.insertOne(data)
    if (result.acknowledged == true) {
        console.log('insert success');
        const newData = await Data.find({_id: result.insertedId});
        res.json({
            "Status": "Insert Success",
            "newData": newData
        })
    } else {
        res.json(result)
    }
};

module.exports.delete = async function(req, res) {
	const id = req.body.id
    var result = await Data.findByIdAndRemove(id)

    if (result !== null) {
        res.json({"Status": Success})
    } else {
        res.json({"Status": fail})
    }
};

module.exports.read = async function(req, res) {
	const id = req.query.id
    const result = await Data.find({_id: id});
    res.json(result)
};

module.exports.edit = async function(req, res) {
	const id = req.body.id
    const newData = req.body.newData
    const doc = await Data.findOne({_id: id});
    const result = await doc.updateOne(newData)
    if (result.modifiedCount > 0) {
        const newData = await Data.findOne({_id: id});
        res.json({
            "Status": "Modify success",
            newData
        })

    } else if (result.modifiedCount == 0 && result.acknowledged == true){
        res.json({"Status": "No data change"})
    } else {
        res.json({"Status": "field not correct"})
    }
};


