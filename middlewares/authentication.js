const { validateToken } = require("../services/authentication");

function checkForAuthenticationCookie(cookieName) {
    console.log("checkForAuthenticationCookie")
    console.log(cookieName)
    return (req, res, next) => {
        const tokenCookieValue = req.cookies[cookieName]
        console.log("tokencookievalue")
        console.log(tokenCookieValue)
        if (!tokenCookieValue) {
            return next()
        }

        try {
            const userpayload = validateToken(tokenCookieValue)
            console.log("userpayload")
            console.log(userpayload)
            req.user = userpayload
        }
        catch (error) { 
          res.redirect("/user/login")
        }
        return next()
    }
}

module.exports = {
    checkForAuthenticationCookie
}