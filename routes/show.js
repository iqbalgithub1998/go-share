const router = require("express").Router();
const File = require("../models/file");

router.get("/:uuid", async (req, res) => {
  try {
    const file = await File.findOne({ uuid: req.params.uuid });
    if (!file) {
      return res.render("downlod", { error: "Link has been expird." });
    }

    // if file exits
    return res.render("download", {
      uuid: file.uuid,
      filename: file.filename,
      fileSize: file.size,
      downloadlink: `${process.env.APP_BASE_URL}/files/download/${file.uuid}`,
    });
  } catch (error) {
    return res.render("downlod", { error: "something went wrong." });
  }
});

module.exports = router;
