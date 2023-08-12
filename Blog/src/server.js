
// 
const express = require ("express")
const handlebars =  require ("express-handlebars")
const app = express ();
const admin = require ("./routes/admin")
const session = require ("express-session")
const flash = require ("connect-flash")
const Post = require ("./model/Postagem")
const Categoria = require ("./model/Categoria")
//Session
app.use (session ( {
    secret: "pass",
    resave: false,
    saveUninitialized: false
}))

app.use (flash ())
//Middleware
app.use ((req,res,next) => {
    res.locals.success_msg = req.flash ("success_msg")
    res.locals.error_msg = req.flash ("error_msg")
    next ()
})
//Configurations
app.use (express.urlencoded ({extended: true}))
app.use (express.json ())

//handlebars
app.engine('handlebars', handlebars.engine({
    defaultLayout: 'main',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,

        allowProtoMethodsByDefault: true,
    }

}));

//moongose
const mongoose = require ("mongoose");
const Postagem = require("./model/Postagem");
  mongoose.connect('mongodb+srv://duh:123@cluster0.hbmk4w5.mongodb.net/?retryWrites=true&w=majority')
  .then(() => console.log('Connected!')).catch ((e) => console.log (e));


  module.exports = mongoose;
  //
app.set('view engine', 'handlebars');

app.set("view engine", "handlebars")
app.set ("views", './views')
//
//public



//
//Routes


app.get ("/",  async  (req,res) => {

    await Post.find ({}).lean ().populate("categoria").sort ({data: 'desc'}).then ((posts) => {
        res.render ("index", {posts})
    }).catch  (() => {
        req.flash ("error_msg", "erro ao carregar  postagens recentes, tente novamente mais tardes")

        res.render ("index")
    })
    
})


app.get ("/postagem/:slug", async (req,res) => {
    await Post.findOne ({slug: req.params.slug}).then ((post) => {
       
        if (post) res.render("postagem/index", {post})

        if (!post) {
            req.flash ("error_msg", "houve um erro ao tentar acessar slug")
            res.redirect ("/")
        }
    
    }).catch (() => {
        req.flash ("error_msg", "houve um erro interno               ")
         res.redirect ("/")
    })
})


app.get ("/categorias", async (req,res) => {
await Categoria.find ({}).then ((categorias) => {

    res.render ("categorias/index", {categorias})
     
}).catch ((err) => {
    req.flash ("error_msg", "Houve um erro intenro")
    res.redirect ("/")
})
 
})
app.use ('/admin', admin)


app.listen (8080, () => {
    console.log ("server on")
})



