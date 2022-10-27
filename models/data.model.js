var mongoose = require('mongoose')

// create schema
var dataSchema = new mongoose.Schema({
	TIME: String,
	CPU: String,
	RAM: String,
	SSD: String,
});

// chuyen doi dataSchema thanh Data, luu vao collection users
//muon lay du lieu hay luu giu lieu vao database thi fiel schema phai trung voi fiel cua database

var Data = mongoose.model('Data', dataSchema, 'ComputerInfo')


	// // a document instance
	// var book1 = new Book({ name: 'Introduction to Mongoose', price: 10, quantity: 25 });

module.exports = Data; // co the dung Data o cac cho khac	