const { default: mongoose } = require("mongoose")
const moongose = require ("mongoose")
const Schema = mongoose.Schema;

const Postagem = new Schema ({
    titulo: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    conteudo: {
        type: String,
        required: true
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: "categorias",
        required: true
    },
    descricao: {
     type: String,
     required: true
    },
    data: {
        type: Date,
        default: Date.now ()
    }
})
moongose.model ("postagens", Postagem)

module.exports = mongoose.model ("postagens")