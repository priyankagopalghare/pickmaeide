var express=require('express');
var ehd=require('express-handlebars');
var app=express();
var cookieParser=require('cookie-parser');

var session=require('express-session');

var qs = require('querystring');
var bodyParser=require('body-parser');
var MongoStore =require('connect-mongo')(session);




app.use(require('express-session')({
    key: 'session',
    secret: 'bhjgbhjbj1452',
    saveUninitialized:true,
    resave:true
}));
app.use(cookieParser());


app.engine('handlebars',ehd());
app.set('view engine','handlebars');

app.use(bodyParser.urlencoded({extended:true}));

app.get('/',function(req,res){
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');

   res.render('index') ;
});

    app.get('/signup',function(req,res){
            res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');

    res.render('signup');
});
app.get('/screenshots',function(req,res){
            res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');

    res.render('screenshots');
});

 app.get('/index',function(req,res){
            res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');

    res.render('index');
});
  
 
app.get('/login',function(req,res){
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    res.render('login');
});

app.get('/datepicker',function(req,res){
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');

    res.render('datepicker');
});

 app.get('/map',function(req,res){
         res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  if(!req.session.user){
    res.render('login',{msg:'you need to login first'});
   }
   else
   {
    res.render('map');
}
});

 app.get('/mapcreatorgoogle',function(req,res){
         res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');

    res.render('mapcreatorgoogle');
});

 app.get('/info',function(req,res){
         res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');

    res.render('info');
});

 app.post('/fndride',function(req,res){
         res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
 
    res.render('fndride');

});
app.use(express.static('public'));



//creating interface and connectiong to database
var mongoose=require('mongoose');
var db=mongoose.connect("mongodb://127.0.0.1/pickmaeride",function(err){
    if(err){
        console.log("not");
        throw err;
    }
    else{
        console.log("connected to db");
    }
});

//creating userschema
/*var userSchema=new mongoose.Schema({
    name:                               //embedded document
    {
      firstname:String,
      lastname:String
    },
    gender:
    {
      type:String,
      required:[true, 'please select gender']
    },

    username:
    {
      type:String,
      required:[true, 'please enter username'],
      unique:true
    },
    password:
    {
      type:String,
      min: [8, 'weak password'],
    }
});*/

//signup schema
var userSchema=new mongoose.Schema({
  firstname:String,
  lastname:String,
  username:{type:String,unique:true},
  gender:String,
  password:String,
   // freq:String,

});  
var user=mongoose.model('usercollection',userSchema);


//feedback schema
var feedbackSchema=new mongoose.Schema({
   name:String,
    email:String,
    message:String
});
var feed=mongoose.model('feedback',feedbackSchema);

//feedback information
app.post('/send_feedback',function(req,res){
    
 
    var name=req.body.name;
    var email=req.body.email;
    var message=req.body.message;

    
     new feed({
        name:req.body.name, 
        email:req.body.email,
       message:req.body.message

    }).save(function(err,result){
        if(err)
            res.json(err);
        else 
            {
               
                console.log('Thanks!for your valueble feedback.');
            }
            
    });    
});



//find a ride schema
/*var findr=new mongoose.Schema({
input_from:String,
input_to:String
});  
var findrideuser=mongoose.model('findridecollection',findr);
*/
//post ride schema
var postr=new mongoose.Schema({
    datepicker:String,
    timepicker:String,
    input_from:String,
    input_to:String,
    cost:String,
    mobile:String,
    username:String,
createdAt:{type: Date,expires:3600}
});  
var postrideuser=mongoose.model('postridecollection',postr);

//login authentication
app.post('/log',function(req,res){
    var name=req.body.username;
    var pass=req.body.password;
   
    mongoose.model('usercollection').findOne({$and:[{"username": name},{"password":pass}]},function(err,result){
        if(err)
            throw err;
        if(result){
            req.session.user=result;

            res.redirect('map');
        }
      
        else
        {
            console.log('login unsuccessfull');
            res.render('login');
           
        }
    });
});



/*app.get('/display',function(req,res){
 var str=req.body.username;
  console.log(str);
   udb.find({firstname: /str/}, callback);

    
});*/
/*app.get('/display', function(req, res){
        usercollection.find({},function(err, docs){
                res.send('index',{docs:docs});
        });
        //res.send('test');
});*/

//signup information
app.post('/send_details',function(req,res){
    var obj=new user(req.body);
    obj.save(function(err,result){
       if(err)
           throw err;
      else
      {
        console.log('registration successfull');
          res.render('login');
      }
        
        
    });

    
});

//post a ride information
app.post('/postride',function(req,res){
    
  var from=req.body.input_from;
    var to=req.body.input_to;
    
    var datepicker=req.body.datepicker;
    var timepicker=req.body.timepicker;
    var mobile=req.body.mobile;
    var cost=req.body.cost;
    var value=req.session.user.username;

    
     new postrideuser({
        input_from:req.body.input_from, 
        input_to:req.body.input_to,
         datepicker:req.body.datepicker,
         timepicker:req.body.timepicker,
         mobile:req.body.mobile,
        cost:req.body.cost,
         username:req.session.user.username,
       createdAt:new Date()

    }).save(function(err,result){
        if(err)
            res.json(err);
        else 
            res.render('index');
    });    
});

//find a ride information
app.post('/findride',function(req,res){
   
 var from=req.body.input_from;
    var to=req.body.input_to;
   
    mongoose.model('postridecollection').find({$and:[{"input_from":from},{"input_to":to}]},function(err,result){
        if(err)
            throw err;
        if(result){
          //res.send(result);
            res.render('info',{data:result});
        }
      
        else
        {
          console.log('no ride found');
           
        }
    });
    
});

app.listen(3000,function(err){
    if(err)
        throw err;
    else{
        console.log("listening at 3000");
    }
});



