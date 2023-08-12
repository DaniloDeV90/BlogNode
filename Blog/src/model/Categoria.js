const mongoose = require ("mongoose")

const Schema = mongoose.Schema;

const Categorias = new Schema ({
    nome: {type:String ,required: true},
    slug: {type:String, required:true},
    date: {type: Date, default: Date.now ()}, 
    update: {type: Date, default: null  } 


}) 

mongoose.model ("categorias", Categorias)




 module.exports =  mongoose.model ('categorias');


