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
app.use(express.static(__dirname));
var blocked_isp = []
var blocked_geo = ['Italy']
var blackl_isp = []
var Koa = require('koa');
const koaProxy = require('koa-proxy');
const mysql = require('serverless-mysql')
var Router = require('koa-router');
var router = new Router();
var URL = require('url').URL;
const app2 = new Koa()


var surl = 'https://www.savorjapan.com/'
var murl = 'https://www.careerclip.com/fetch.php'

app2.use(koaProxy({
  host: surl
}))

app.use(requestIp.mw())


const db = mysql({
  config: {
  	host:'cloaker.mysql.database.azure.com',
    database: 'quickstartdb',
    user: 'nfcurti@cloaker',
    password: '862554zZ',
  },
})



app.get("/",async (req, res, next) => {

console.log("IP: "+process.env.MYSQL_HOST)

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

					    var date =  new Date(Date.now())
					    console.log(date)
					    var isp = JSON.parse(data).isp || "empty"
					    var geo = JSON.parse(data).country || "empty"
					    console.log(date+isp+geo)
					    	if(blocked_isp.includes(JSON.parse(data).isp) == false){
									const users =  db.query(`INSERT INTO cloaker (date, isp, geo) VALUES ('${date}','${isp}', '${geo}')`);
									  
									console.log('1')
									res.status(200).redirect('http://localhost:5500/');
									res.end();
					    	} else{
					    		if(blocked_geo.includes(JSON.parse(data).country) == false){
						    		const users =  db.query(`INSERT INTO cloaker (date, isp, geo) VALUES ('${date}','${isp}', '${geo}')`);
									  
									console.log('2')
									
									res.status(200).redirect('http://localhost:5500/');res.end();
					    		}else{
					    		request({uri: murl}, 
								    async function(error, response, body) {
								    const users =  db.query(`INSERT INTO cloaker (date, isp, geo) VALUES ('${date}','${isp}', '${geo}')`);
									  
									
									console.log('3')
									res.status(200).redirect(body);
									res.end();
								  });
								
								}
					    	}
					    }else {
					    	var date =  new Date(Date.now())
					    var isp = JSON.parse(data).isp || "empty"
					    var geo = JSON.parse(data).country || "empty"
					    console.log(date)
					    		const users =  db.query(`INSERT INTO cloaker (date, isp, geo) VALUES ('${date}','${isp}', '${geo}')`);
								
									console.log('4')
									res.status(200).redirect('http://localhost:5500/');
					    }
				  })
				}).on('error', function(e) {  console.log(e) ;});

			}
			else
			{
request({uri: murl}, 
								    async function(error, response, body) {
								    const users =  db.query(`INSERT INTO cloaker (date, isp, geo) VALUES ('${date}','${isp}', '${geo}')`);
									  
									
									console.log('5')
									res.status(200).redirect(body);
									res.end();
								  });
					    		
			} 
	});
});

// Mock APIs
app.get("/setup", (req, res) => {
  res.status(200).render('setup', {surl:surl, murl:murl, blocked_isp:blocked_isp,blocked_geo:blocked_geo});
});

app.get("/stats", async (req, res) => {
const users = await db.query(`select * from cloaker`);
const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const d = new Date();
var month = d.getMonth()
var mes = monthNames[month].substring(0,3)

var du = new Date();
var n = du.getDate();

var day = mes + ' ' + n
console.log('Today is '+ day)
const safe = await db.query(`select * from cloaker where isp='empty'`);
const analytic = await db.query(`SELECT isp, COUNT(*) FROM cloaker GROUP BY isp`);
const thisMonth = await db.query(`SELECT isp, COUNT(*) FROM cloaker  WHERE date LIKE '%${mes}%' GROUP BY isp`);
const today = await db.query(`SELECT isp, COUNT(*) FROM cloaker  WHERE date LIKE '%${day}%' GROUP BY isp`);

console.log(today[0].isp)
	res.status(200).render('stats', {blackl_isp:blackl_isp,today:today,thisMonth:thisMonth,analytic:analytic,safe:safe,blocked_isp:blocked_isp,blocked_geo:blocked_geo, hits:users});
	
});

app.post("/user", (req, res) => {
	  murl = req.body.moneypage_file;
	  surl = req.body.safepage_url;
  	 res.send({ status: "Updated correctly. Check safe/money page to validate. " });
});

app.get("/wl", (req, res) => {
	  

	  if(blocked_isp.includes(req.query.isp)==true){
	  	blocked_isp.splice(blocked_isp.indexOf(req.query.isp), 1)
	  }else{
	  	console.log(req.query.isp)
	  	blocked_isp.push(req.query.isp.replace("amp;", ""))
	  }
  	 res.redirect('/stats');
});

app.get("/bl", (req, res) => {
	  

	  if(blackl_isp.includes(req.query.isp)==true){
	  	blackl_isp.splice(blackl_isp.indexOf(req.query.isp), 1)
	  }else{
	  	console.log(req.query.isp)
	  	blackl_isp.push(req.query.isp)
	  }
  	 res.redirect('/stats');
});

app.post("/blackl", (req, res) => {
  console.log(req.body)
  blocked_isp = req.body.bisp;
  blocked_geo = req.body.bgeo;
  res.send({ status: "Your domain's blacklist has been updated" });
});

app2.listen(process.env.PORT || 5500, () => {
  console.log(`
Visit http://localhost:5500`);
});

// Listen on port 5000
app.listen(process.env.PORT || 5000, () => {
  console.log(`
Visit http://localhost:5000`);
});