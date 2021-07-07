const router = require("express").Router();
const multer = require("multer");
const File = require("../models/file");
const { v4: uuid4 } = require("uuid");

let storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "upload/"),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${
      file.originalname
    }`;
    cb(null, uniqueName);
  },
});

let upload = multer({
  storage,
  limit: { fileSize: 5000000 },
}).single("myfile");

router.post("/", (req, res) => {
  // store file in upload folder
  upload(req, res, async (err) => {
    console.log(req);
    // validate request
    if (!req.file) {
      return res.json({ error: "All fields are required." });
    }
    if (err) {
      res.status(500).send({ error: err.message });
    }

    const file = new File({
      filename: req.file.filename,
      pin: 0,
      uuid: uuid4(),
      path: req.file.path,
      size: req.file.size,
    });

    // saving to database

    const response = await file.save();
    return res.json({
      //file: response._id,
      file: `${process.env.APP_BASE_URL}/files/${response.uuid}`,
    });
  });
});

// set pin to the file code is here..

router.post("/pin", async (req, res) => {
  const { uuid, pin } = req.body;
  if (!pin) {
    return res.status(422).send({ error: "Pin is required." });
  }
  const file = await File.findOne({ uuid: uuid });
  console.log(file, pin);
  file.pin = pin;

  const response = await file.save();
  return res.json({
    file: response,
  });
});

router.post("/send", async (req, res) => {
  const { uuid, emailTo, emailFrom } = req.body;

  //validate request

  if (!uuid || !emailTo || !emailFrom) {
    return res.status(422).send({ error: "All fields are required." });
  }

  // get data from database

  const file = await File.findOne({ uuid: uuid });
  if (file.sender) {
    return res.status(422).send({ error: "Email already send." });
  }
  file.sender = emailFrom;
  file.receiver = emailTo;
  const response = await file.save();

  // send file
  const sendMail = require("../services/emailService");

  sendMail({
    from: emailFrom,
    to: emailTo,
    subject: "Go share file sharing.",
    text: `${emailFrom} share a file with you.`,
    html: require("../services/emailTemplate")({
      emailFrom: emailFrom,
      downloadlink: `${process.env.APP_BASE_URL}/files/${file.uuid}`,
      size: parseInt(file.size / 1000) + "KB",
      expires: "24 hours",
    }),
  });

  return res.send({ success: true });
});

module.exports = router;
