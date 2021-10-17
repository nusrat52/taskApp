const express = require("express");
const users = require("../models/users");
const tasks = require("../models/tasks");
const router = express.Router()
const multer=require('multer')
const auth=require("../models/auth");
const { Error } = require("mongoose");
const sharp=require("sharp")
  const {greetingUser,farewelllUser}=require("../email/sGrid")




const avatar = multer({
   limits: {
    fileSize:1000000
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("extentinlar jpg jpeg png"))
    }

    cb(undefined, true)
  }
})

router.post("/users/profile/avatar", auth, avatar.single("avatar"), async (req, res) => {
  const Buff=await sharp(req.file.buffer).resize({width:250, height:250}).png().toBuffer()
  req.user.avatar = Buff
  req.user.save()
  res.send({ ok: "ok" })
  


}, (error, req, res, next) => {
  if (error) {
    console.log(error);
    res.status(400).send({error:error.message})
  }
})

router.delete("/users/profile/avatar", auth, (req, res) => {
  req.user.avatar = null
  req.user.save()
  res.send({ ok: "ok" })
  


}, (error, req, res, next) => {
  if (error) {
    res.status(400).send({error:error.message})
  }
})


router.get("/users/:id/profile/avatar", async (req, res) => {
  try {

    console.log(req.params.id);
    const user = await users.findById(req.params.id)
    console.log(user);
  
    if (!user || !user.avatar) {
      throw new Error("user yada sekili yoxdu")
    }

    res.set("Content-Type", "image/jpg")
    res.send(user.avatar)
  } catch (e) {
    res.send(e.message)
  }
})



router.post("/users/logout", auth, (req, res) => {
  try {
     req.user.tokens=req.user.tokens.filter((token) => {
  return req.token!==token.token
    })
    req.user.save()
   res.status(200).send(req.user.makePublic())
  } catch (e) {
    console.log(e);
    res.status(501).send()

  }
})


router.post("/users/logoutAll", auth, (req, res) => {
   try {
    req.user.tokens = req.user.tokens.filter(({ token }) => {
    
      return req.token === token
    })
    req.user.save()
    res.send(req.user.makePublic())
  } catch (e) {
    res.status.send(e)
  }
})





router.delete("/users/delete", auth ,async (req, res) => {
  try {
const {name, email}=req.user

 await tasks.deleteMany({userId:req.user._id})
 await users.findOneAndDelete({_id:req.user._id}) 
 farewelllUser(email, name)
    res.send(req.user)
  } catch (e) {
    console.log(e);
    res.send(e)
  }
})

router.post("/users/login", async (req, res) => {
    try {
      const user = await users.loginFunct(req.body.email, req.body.password)
      
      const token = await user.tokenGenerate()
        res.send({user, token})
    } catch (e) {
        console.log(e);
        res.status(501).send(e)
    }

})







router.post("/users", async (req, res) => {
    const user = await new users(req.body);
    try {
      const response = await user.save();



      const token = await user.tokenGenerate()
      
      greetingUser(user.email, user.name)
      res.send({response:user.makePublic(), token});
    } catch (e) {
       res.status(500).send(e);
      
    }
});
  






router.get("/users/profile", auth, async (req, res) => {
 try {
    res.send(req.user.makePublic())
  }catch (e) {
    res.send(e)
  }
  
});




  
  router.get("/users/:id", async (req, res) => {
    try {
      const response = await users.findById(req.params.id);
      if (!response) {
        return res.status(404).send({error:"yoxdu"});
      }
  
      res.send(response.makePublic());
    } catch (e) {
      res.send(e);
    }
  });

  
  router.patch("/users/profile",auth, async (req, res) => {
    
  
    const upParams = req.body
    const isAllowed = ['age', 'name', 'email', 'password']
    const uParamsArr = Object.keys(upParams)
    const isValidUpdate = uParamsArr.every((ke) => {
     return isAllowed.includes(ke)
    })
    if (!isValidUpdate) {
      return res.status(404).send({error:"olmure bele"})
    }
       try {
          const response = req.user
 
      uParamsArr.forEach(params => {
          response[params] = upParams[params]
          
         
      });
       await response.save()
       
      res.send(response.makePublic())
    } catch (e) {
      res.send(e)
    }
  })
  
  
  
  
  
  






module.exports=router