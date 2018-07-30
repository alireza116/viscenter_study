/**
 * Created by fablab on 6/7/2017.
 */
var express = require('express');
var app = express();
var cors = require('cors');
var bodyparser  = require('body-parser');



var routes = require('./api/routes/index');
// console.log(routes);

port = process.env.PORT || 3005;

app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json());
app.use(cors());
app.use("/", express.static(__dirname + '/public'));
app.use('/', routes);

var router = express.Router();
// router.get('/',function(req,res){
//     res.json({message: 'kiram dahanet'})
// });

app.use('/api', router);
app.listen(port);
console.log('api running on ' + port);

