const apiKey = "x"
const id = "x"

const express = require("express");
const request = require("request");
const https = require("https");
const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended:true }));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname);

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/singup.html");
});

app.post("/",(req,res) =>{
    let fname= req.body.inputFirst;
    let lname= req.body.inputLast;
    let email= req.body.inputEmail;

    const url = "https://us21.api.mailchimp.com/3.0/lists/" + id;
    const options = {
        method: "POST",
        auth: "0243794:" + apiKey
    }

    let data = {
        members: [{
              EMAIL: email,
              status: "subscribed",
              merge_fields: {
                  FNAME: fname,
                  LNAME: lname
                }
            }]
      }

    let jsonData = JSON.stringify(data);
    let mailRequest = https.request(url, options, (response) => {
        if(response.statusCode === 200) {
            response.on("data", (data) => {
                let jsonResp = JSON.parse(data);
                if(jsonResp["error_count"] === 0) {
                  res.render(__dirname + "/succes.html");
                } else {
                    res.render(__dirname + "/failure.html",);
                }
            })
            .on("error", () => {
                res.render(__dirname + "/failure.html");
            });
        } else {
          res.render(__dirname + "/failure.html");
        }
    });

    mailRequest.write(jsonData);
    mailRequest.end();

});

app.listen(3001, () => {
    console.log("Listening on port 3000");
});