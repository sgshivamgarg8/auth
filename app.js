var express = require("express"),
app = express(),
mongoose = require("mongoose"),
passport = require("passport"),
bodyParser = require("body-parser"),
LocalStrategy = require("passport-local"),
passportLocalMongoose = require("passport-local-mongoose"),
User = require("./models/user")
app.set("view engine", "ejs");

// mongoose.connect("mongodb://localhost/auth",{useNewUrlParser:true});
mongoose.connect("mongodb://shivam:shivam@cluster0-shard-00-00-bfppm.mongodb.net:27017,cluster0-shard-00-01-bfppm.mongodb.net:27017,cluster0-shard-00-02-bfppm.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true",{useNewUrlParser:true});

app.use(bodyParser.urlencoded({extended: true}));

app.use(require("express-session")({
	secret: "Hello, This is my Secret Line",
	resave: false,
	saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());


passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get("/", function(req,res){
	res.render("home");
});

app.get("/secret", isLoggedIn, function(req,res){
	res.render("secret");
});


app.get("/register", function(req,res){
	res.render("register");
});

app.post("/register", function(req,res){
	User.register(new User({username:req.body.username}),req.body.password, function(err, user){
		if(err){
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req,res,function(){
			res.render("secret");
		});
	});
});

app.get("/login", function(req,res){
	res.render("login");
});

app.post("/login", passport.authenticate("local",{
	successRedirect: "/secret",
	failureRedirect: "/login"
}) ,function(req,res){	
});

app.get("/logout", function(req,res){
	req.logout();
	res.redirect("/");
})

//Middleware to check if user is logged in
function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}


app.listen(3000, function(){
	console.log("Server Started");
});