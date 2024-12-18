const jwt=require("jsonwebtoken")
const createError=require("http-errors")


module.exports={
    signAccessToken:(userId)=>{
        return new Promise((resolve,reject)=>{
            const payload={
                id: userId,
            }
            const secret=process.env.ACCESSTOKEN_SECRET
            const options={
                expiresIn: "1h"
            }
            jwt.sign(payload,secret,options,(err,token)=>{
                if(err){
                    console.log(err.message)
                    reject(createError.InternalServerError())
                }
                resolve(token);
            })
        })
    },
    verifyAccessToken:(req,res,next)=>{
        if(!req.headers['authorization']) {return next(createError.Unauthorized())}
        const authHeader=req.headers['authorization']
        const bearerToken=authHeader.split(" ")
        const token=bearerToken[1];
        jwt.verify(token, process.env.ACCESSTOKEN_SECRET, (err,payload)=>{
            if(err){
                if(err.name==='JsonWebTokenError'){
                    return next(createError.Unauthorized())
                }else{
                    return next(createError.Unauthorized(err.message))
                }
            }
            req.user=payload
            next()
        })
    },
    // signRefreshToken:(userId)=>{
    //     return new Promise((resolve,reject)=>{
    //         const payload={
    //             name: userId,
    //         }
    //         const secret=process.env.REFRESHTOKEN_SECRET
    //         const options={
    //             expiresIn: "1y",
    //         }
    //         jwt.sign(payload,secret,options,(err,token)=>{
    //             if(err){
    //                 console.log(err.message)
    //                 reject(createError.InternalServerError())
    //             }
    //             resolve(token);
    //         })
    //     })
    // },
    // verifyRefreshToken:(refreshToken)=>{
    //     return new Promise((resolve, reject)=>{
    //         jwt.verify(refreshToken, process.env.REFRESHTOKEN_SECRET,(err, payload)=>{
    //             if(err){return reject(createError.Unauthorized())}
    //             const userId=payload.aud
    //             resolve(userId)
    //         })
    //     })
    // }
}