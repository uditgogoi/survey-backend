const sendApiError=(res,message)=> {
    res.status(401).json({
        status:'err',
        message:message
    })
}

module.exports= {sendApiError}