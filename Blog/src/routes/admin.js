const express = require("express")
const Categoria = require("../model/Categoria");
const Post = require("../model/Postagem");

const router = express.Router();


router.get('/', (req, res) => {
    res.send("Pagina pricipal do painel ADM")

})
router.get('/posts', (req, res) => {
    res.send("Pagina de post")




})

//Categorias

router.get("/categorias", async (req, res) => {

    const findAll = await (Categoria.find({})).catch(() => req.flash("error_msg", "Houve um erro ao listar"))

    res.render("admin/categoria", { findAll })
})

router.get("/categorias/add", (req, res) => {

    res.render("admin/addcategoria")
})



function ErrorsVerify(nome, slug) {
    let erros = []

    if (!nome ||
        typeof (nome) == undefined ||
        nome == null) erros.push({ texto: "Nome inválido" });

    const regexMaiscule = /[A-Z]/;
    const regexSpace = /\s/;

    if (!slug ||
        typeof (slug) == undefined ||
        slug == null ||
        regexMaiscule.test(slug) ||
        regexSpace.test(slug)) erros.push({ texto: "Slug inválido" });

    return erros;
}


router.post("/categorias/nova", (req, res) => {


    let erros = ErrorsVerify(req.body.nome, req.body.slug)



    if (erros.length > 0) {
        res.render("admin/addcategoria", { erros });
    } else {

        new Categoria({

            nome: req.body.nome,
            slug: req.body.slug
        }).save().then(() => {
            req.flash("success_msg", "Categoria criada com sucesso!!")



        }).catch(() => {
            req.flash("error_msg", "erro ae")

        }).finally(() => {
            res.send(res.redirect("/admin/categorias"))
        })

    }
})



router.get("/categorias/deletar/:id", async (req, res) => {

    await Categoria.deleteOne({ _id: req.params.id }).then(() => res.redirect("/admin/categorias")).catch(() => res.send("erro"));
})

router.get("/categorias/editar/:id", async (req, res) => {

    const { id } = req.params

    await Categoria.findOne({ _id: id }).then(categoria => {
        res.render("admin/categoriaEditar", { id, categoria })
    }).catch(() => {
        req.flash("error_msg", "esta categoria não existe")
        res.redirect("/admin/categorias")

    })
})

router.post("/editar/catego", async (req, res) => {
    const { id } = req.body
    const categoria = await Categoria.findOne({ _id: id })
    let erros = ErrorsVerify(req.body.nome, req.body.slug)

    if (erros.length > 0) {
        res.render("admin/categoriaEditar", { erros, id, categoria });
    } else {
        await Categoria.findByIdAndUpdate(id, { nome: req.body.nome, slug: req.body.slug, update: Date.now(), }).then(() => {

            req.flash("success_msg", "Categoria editada com sucesso!!")

        }).catch(() => res.send(req.flash("error_msg", "Erro ao editar mensagem"))).finally(() => {
            res.redirect("/admin/categorias")
        })
    }

})

//Postagens



router.get("/postagens", async (req, res) => {
    await Post.find({}).lean().populate('categoria').sort({ data: 'desc' }).then((postagens) => res.render("admin/postagens", { postagens })).catch(() => {
        req.flash("error_msg", "falha ao recuperar dados")
        res.redirect("admin/postagens")

    })

})

router.get("/postagens/add", async (req, res) => {
    await Categoria.find({}).then((categorias => {
        res.render("admin/addpostagens", { categorias })
    })).catch(() => {
        req.flash("Erro ao carregar o formulário")
        res.redirect("/")
    })

})

router.post("/postagens/nova", (req, res) => {
    let erros = []

    if (req.body.categoria == "0") erros.push({ text: "Categoria inválida" })
    if (erros.length > 0) {
        console.log(erros)
        res.render("admin/addpostagens", { erros })
    } else {
        new Post({
            titulo: req.body.titulo,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            slug: req.body.slug,
            categoria: req.body.categoria
        }).save().then(() => req.flash("success_msg", "postagem adicionada!")).catch(() => {
            req.flash("error_msg", "erro ao salvar")

        }).finally(() => {
            res.redirect("/admin/postagens")
        })

    }
})



router.get("/postagens/edit/:id", async (req, res) => {


    Post.findOne({ _id: req.params.id }).lean().populate('categoria').sort({ data: 'desc' }).then((postagem) => {
        Categoria.find({}).then((categoria) => {


            res.render("admin/editPostagens", { categoria, postagem })
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao listar")
            res.redirect("/admin/postagens")

        })
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao carregar o form")
        res.redirect("/admin/postagens")
    })

})

router.post("/postagens/editar", async (req, res) => {

    await Post.findByIdAndUpdate(req.body.id, { titulo: req.body.titulo, slug: req.body.slug, conteudo: req.body.conteudo, categoria: req.body.categoria, descricao: req.body.descricao }).then(() => {
        req.flash("success_msg", "Postagem editada com sucesso!!") 
    }).catch((erro) => req.flash ("error_msg", "Erro ao editar postagem"))
    .finally (() => {
        res.redirect("/admin/postagens")
    })


})

router.post ("/postagens/deletar/:id",async(req,res) => {


    await Post.deleteOne ({_id: req.params.id}).then ( () => {
      req.flash ("success_msg", "post apagado com sucesso!!")
    }) .catch (() => {
        req.flash ("error_msg", "erro ao apagar  post!!")
    })
    .finally (() => {
        res.redirect("/admin/postagens")
    })
    
})


module.exports = router;