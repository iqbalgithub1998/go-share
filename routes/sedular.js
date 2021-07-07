const router = require("express").Router();
const File = require("../models/file");
const fs = require("fs");


router.get('/',(req, res)=>{
    async function deleteData() {
        const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const files = await File.find({ createdAt: { $lt: pastDate } });
        if (files.length) {
          for (const file of files) {
            try {
              fs.unlinkSync(file.path);
              await file.remove();
            } catch (error) {
                res.status(500).send("some error occur");
            }
            
          }
          
        }
      }
      deleteData().then(()=>{
        res.render("schedular");
      })

})


module.exports = router;