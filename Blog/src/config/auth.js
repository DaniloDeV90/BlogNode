const LocalStrategy = require("passport-local").Strategy

const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")


const Usuario = mongoose.model("usuarios")

module.exports = function (passport) {

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser(async (id, done) => {

        await Usuario.findById(id).then(successo => {
            done(null, successo)
        })
    })

    passport.use(new LocalStrategy({ usernameField: 'email', passwordField: "senha" }, (email, senha, done) => {
        try {
            Usuario.findOne({ email: email }).then(usuario => {
                if (!usuario) {
                    return done(null, false, { message: "Esta conta não existe" })
                }

                const isValid = bcrypt.compareSync(senha, usuario.senha)

              
                if (!isValid) return done(null, false, { message: "Senha incorreta!!" })
                return done(null, {id: usuario._id, nome: usuario.nome})
            })
        } catch (err) {
        
            return done(err, false)
        }

    }))
}


