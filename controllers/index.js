exports.getIndex = (req, res ) => {
    const {token} = req.cookies
    if (token){
        res.redirect("/carcon1");
    } else {
        res.render("index");
    }
}