const sendApiError=(res,message)=> {
    res.status(401).json({
        status:0,
        message:message
    })
}

module.exports= {sendApiError}