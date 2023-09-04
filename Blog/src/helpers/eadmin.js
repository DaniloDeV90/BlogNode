module.exports = {
    edmin: function (req,res,next) {
        if (req.isAuthenticated() && req.user.eAdmin == 1) return next ();

        req.flash ("error_msg", "voce  precisar ser um admin")
        res.redirect ("/")
    }
}