import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const PORT = process.env.PORT || process.env.LOCAL_PORT;

const corsOptions = { origin: true, credentials: true };

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
  res.json("Running node server.");
});

app.post("/connect", (req, res) => {
  const { name, email, message } = req.body;

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.USER,
      pass: process.env.PASSWORD,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
    },
  });

  let mailOptions = {
    from: `"PORTFOLIO" "<"${process.env.MAIL_USER}">"`,
    to: process.env.USER,
    subject: "Portfolio Contact",
    html: `
          <h3>${name},</h3>\n
          <h4>${email}</h4>\n
          <p>${message}</p>`,
  };

  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      res.json({ error: err });
    } else {
      res.status(200).json({ message: "Mail sent successfully!" });
    }
  });
});

app.listen(PORT, () => {
  console.log(`PORT @ ${PORT}`);
});
