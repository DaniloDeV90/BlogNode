
// 
const dotenv = require ("dotenv")

dotenv.config ()
const express = require("express")
const handlebars = require("express-handlebars")
const app = express();
const admin = require("./routes/admin")
const usuarios = require("./routes/usuario")
const session = require("express-session")
const flash = require("connect-flash")
const Post = require("./model/Postagem")
const path = require("path")
const Categoria = require("./model/Categoria")

const passaport = require("passport")
require("./config/auth")(passaport)

//Session
app.use(session({
    secret: "pass",
    resave: true,
    saveUninitialized: true,
    cookie: {maxAge: 2 * 60 * 1000}

})) 
app.use(passaport.initialize())
app.use(passaport.session())
app.use(flash())
//Middleware
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    res.locals.error = req.flash ("error")
    res.locals.user = req.user || null;
    next()
})
//Configurations
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//handlebars
app.engine('handlebars', handlebars.engine({
    defaultLayout: 'main',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,

        allowProtoMethodsByDefault: true,
    }

}));

//moongose
const mongoose = require("mongoose");
const Postagem = require("./model/Postagem");
const passport = require("passport");

mongoose.connect(process.env.CONNECT)
    .then(() => console.log('Connected!'));


module.exports = mongoose;
//
app.set('view engine', 'handlebars');

app.set("view engine", "handlebars")
app.set("views", path.join(__dirname, '/views'))
//
//public



//
//Routes


app.get("/", async (req, res) => {

    await Post.find({}).lean().populate("categoria").sort({ data: 'desc' }).then((posts) => {
        res.render("index", { posts })
    }).catch(() => {
        req.flash("error_msg", "erro ao carregar  postagens recentes, tente novamente mais tardes")

        res.render("index")
    })

})


app.get("/postagem/:slug", async (req, res) => {
    await Post.findOne({ slug: req.params.slug }).then((post) => {

        if (post) res.render("postagem/index", { post })

        if (!post) {
            req.flash("error_msg", "houve um erro ao tentar acessar slug")
            res.redirect("/")
        }

    }).catch(() => {
        req.flash("error_msg", "houve um erro interno               ")
        res.redirect("/")
    })
})


app.get("/categorias", async (req, res) => {
    await Categoria.find({}).then((categorias) => {

        res.render("categorias/index", { categorias })

    }).catch((err) => {
        req.flash("error_msg", "Houve um erro intenro")
        res.redirect("/")
    })

})

app.get("/categorias/:slug", async (req, res) => {
    await Categoria.findOne({ slug: req.params.slug }).then((categoria) => {

        if (categoria) {
            Postagem.find({ categoria: categoria._id }).then((posts) => {

                res.render("categorias/todaspostagens", { posts, categoria })
            }).catch((error) => {
                req.flash("error_msg", "erro ao listar posts")
                res.redirect("/")
            })
        } else {
            req.flash("error_msg", "erro ao carregar categoria")
            res.redirect("/")
        }

    }).catch(() => {
        req.flash("error_msg", "erro interno")
        res.redirect("/")
    })
})


app.get ("/logout", (req,res) => {
   
    req.logOut ((erro) => {
        if (erro) {
            req.flash("error_msg", "erro ao deslogar")
     
        }
        res.redirect ("/")
    })
 
})



app.use('/admin', admin)
app.use("/usuarios", usuarios)

app.listen(8080, () => {
    console.log("server on em: localhost:8080")
})



