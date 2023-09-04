const Usuario = require("../model/Usuario")
const express = require("express")
const router = express.Router();
const bcrypt = require ("bcryptjs")
const passport = require ("passport")
router.get("/registro", (req, res) => {
    res.render("usuarios/registro")
})

router.post("/registro", async (req, res) => {
    let erros = []

    const form = {
        nome: req.body.nome,
        senha: req.body.senha,
        email: req.body.email,

    }


    if (req.body.senha.length < 6) erros.push({ texto: "Senha deve ter no mínimo 6 caracteres" })
    if (!(req.body.senha == req.body.senha2)) erros.push({ texto: "Senhas não condizem" })
    console.log(erros)
  

    const verify = await Usuario.findOne({ email: form.email }).then((sucesso) => sucesso)

    if (verify) erros.push({ texto: "este email já foi cadastrado em nossa base de dados" })
    if (erros.length) {
        res.render("usuarios/registro", { erros, form })
        return;
    }

     bcrypt.genSalt (10, (erro, salt) => {
        bcrypt.hash (form.senha,salt, (erro,hash) => {
            if (erro) {
                req.flash ("erro_msg", "Houve um erro durante o salvamento")
                res.redirect ("/")
                return;
            }

            new Usuario ({ 
                nome: form.nome,
                email: form.email,
                senha:  hash,
             
            
            
            }).save ().then (() => {
              req.flash ("success_msg", "usuario salvo com sucesso!")
            }).catch (() => {
                req.flash ("error_msg", "Erro ao salvar usuario, tente novamente mais tarde")
            }).finally (() => {
                res.redirect ("/")
            })
        })
     })

})

router.get ("/login", (req,res) => {
 
    res.render ("usuarios/login")
 })

 router.post ("/login", passport.authenticate ("local", {
    successRedirect: "/",
    failureRedirect: "/usuarios/login?fail=true",
    failureFlash: true})
 )
 
module.exports = router;


