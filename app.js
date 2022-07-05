const express = require("express");
const bodyParser =  require("body-parser")
const request = require("request");
const https = require("https");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));


// GET method
app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});


// POST method
app.post("/", function(req, res) {
    const firstName = req.body.fName;
    const lastName =  req.body.lName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields:{
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonDATA = JSON.stringify(data);
    const url = "https://us8.api.mailchimp.com/3.0/lists/42f58bf415";

    const options = {
        method : "POST",
        auth: "sourin:e29952f5fb0a363c7f58da8fe2f8f19d-us8"
    }

    const request = https.request(url, options, function(response){

        if(response.statusCode === 200){
            // res.send("Thank You for Subscribing to my Newsletter!")
            res.sendFile(__dirname + "/success.html");
        }else{
            // res.send("There was an error signing up, please try again!")
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })
    request.write(jsonDATA);
    request.end();
});

app.post("/failure", function(){
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, function(){
    console.log("Server is running on port 3000.")
});


// API key:
// e29952f5fb0a363c7f58da8fe2f8f19d-us8

// List ID
// 42f58bf415