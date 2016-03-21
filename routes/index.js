var express = require('express');
var router = express.Router();
var request = require('request');
var config = require("../config");

/* GET home page. */
router.get('/', function(req, res, next) {
    res.redirect("https://secure.meetup.com/oauth2/authorize"+
    "?client_id=" + config.client_id +
    "&response_type=code"+
    "&redirect_uri=http://localhost:3000/success")
});

router.get('/success', function(req,res,next){
    request.post("https://secure.meetup.com/oauth2/access", {
        form:{
            client_id: config.client_id,
            client_secret: config.client_secret,
            grant_type:"authorization_code",
            redirect_uri:"http://localhost:3000/success",
            code:res.req.query.code
        }
    }, function(err, response, body) {
        if(err){
            console.log("error", err)
        } else {
            var obj = JSON.parse(body);
            request.get("https://api.meetup.com/womenwhocodenyc/events/229437778/rsvps?access_token="+obj.access_token ,
                function(err, response3, body) {
                    if(err) {
                        console.log("err", err)
                    } else {
                        var parsed = JSON.parse(body)
                        var names = parsed.map(function(rsvp) {
                            return rsvp.member.name;
                        })
                        res.send(names)
                    }
                })
        }
    })
})

module.exports = router;
