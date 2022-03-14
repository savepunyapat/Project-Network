const express = require("express");
const app = express();
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const path = require("path");

const routesIndex = require("./routes/index");
const routesTodo = require("./routes/todo");
const routesCarRent = require("./routes/carRent");
const routesCarsuccess = require("./routes/carsuccess");
const routesDashboard = require("./routes/dashboard");
const routesCarCon1 = require("./routes/carcon1");
const routesAlert = require("./routes/alert");


const querystring = require("querystring");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const cookieParser = require("cookie-parser");
const req = require("express/lib/request");
require("dotenv").config();

app.set("view engine", "ejs");
app.set("views", "views");
app.use(cookieParser());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);


app.use(routesIndex);
app.use(routesTodo);
app.use(routesCarRent);
app.use(routesCarsuccess);
app.use(routesDashboard);
app.use(routesCarCon1);
app.use(routesAlert);

app.use(express.static(path.join(__dirname, "public")));

const redirectURI = "auth/google";

mongoose.connect("mongodb+srv://save1412:save1412@cluster0.avz4t.mongodb.net/myFirstDatabase?retryWrites=true&w=majority").then(() => {
  console.log(":: Connected to database successfully.");
});

var db = mongoose.connection;


db.collection("cats").findOne({},function(err,res){
  if(err) throw err;
  console.log(res.name);
  db.close
});





function getGoogleAuthURL() {
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const options = {
    redirect_uri: `${process.env.SERVER_ROOT_URI}/${redirectURI}`,
    client_id: process.env.GOOGLE_CLIENT_ID,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
  };
  return `${rootUrl}?${querystring.stringify(options)}`;
}

app.get("/auth/google/url", (req, res) => {
  return res.send(getGoogleAuthURL());
});

function getTokens({ code, clientId, clientSecret, redirectUri }) {
  const url = "https://oauth2.googleapis.com/token";
  const values = {
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
  };

  return axios
    .post(url, querystring.stringify(values), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
    .then((res) => res.data)
    .catch((error) => {
      console.error(`Failed to fetch auth tokens`);
      throw new Error(error.message);
    });
}

app.get(`/${redirectURI}`, async (req, res) => {
  const code = req.query.code;

  const { id_token, access_token } = await getTokens({
    code,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: `${process.env.SERVER_ROOT_URI}/${redirectURI}`,
  });

  const googleUser = await axios
    .get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
      {
        headers: {
          Authorization: `Bearer ${id_token}`,
        },
      }
    )
    .then((res) => res.data)
    .catch((error) => {
      console.error(`Failed to fetch user`);
      throw new Error(error.message);
    });

  const token = jwt.sign(googleUser, process.env.JWT_SECRET);

  res.cookie(process.env.COOKIE_NAME, token, {
    maxAge: 86400000,
    httpOnly: true,
    secure: false,
  });

  res.redirect("/");
});

app.get("/auth/me", (req, res) => {
  console.log("get me");
  try {
    const decoded = jwt.verify(req.cookies[process.env.COOKIE_NAME], process.env.JWT_SECRET);
    console.log("decoded", decoded);
    return res.send(decoded);
  } catch (err) {
    console.log(err);
    res.send(null);
  }
});
app.get('/carRent',(req,res)=>{
  let name = "save";
  res.render('carRent',{
      userName : name
  });
})

app.get("/logout", (req, res) => {
    res.clearCookie(process.env.COOKIE_NAME)
    res.redirect("/");
});



// Running
app.listen(4000, () => {
  console.log("server start");
});
