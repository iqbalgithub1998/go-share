const express = require("express");

const app = express();

const connectDB = require("./config/db");

connectDB();

// cors setup ................
const cors = require("cors");

const corsOptions = {
  origin: process.env.ALLOWED_CLIENTS.split(','),
};
app.use(cors(corsOptions));
// path initialization
const path = require("path");

app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.json({ extended: true }));

// routes are here ................

app.use("/api/file/delete", require("./routes/DeleteFile"));
app.use("/api/files", require("./routes/files"));
app.use("/files", require("./routes/show"));
app.use("/files/download", require("./routes/download"));
app.use("/sedular",require("./routes/sedular"));
app.use("/api/user", require("./routes/register"));
app.use("/api/auth", require("./routes/auth"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, (req, res) => {
  console.log(`server is running on http://localhost:${PORT}`);
});
