const router = require("express").Router();
const File = require("../models/file");
const fs = require("fs");

router.delete("/", async (req, res) => {
  const { uuid } = req.body;
  if (!uuid) {
    return res.status(422).send({ error: "Some error occor" });
  }
  const file = await File.findOne({ uuid: uuid });
  try {
    fs.unlinkSync(file.path);
    await file.delete();
    return res.status(422).send({ success: "file deleted." });
  } catch (error) {
    res.status(500).send("some error occur");
  }
});

module.exports = router;
