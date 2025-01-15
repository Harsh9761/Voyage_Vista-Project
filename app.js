if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
var methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const User = require("./models/user.js");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const Listing = require("./models/listing.js");



const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");
const wrapAsync = require("./utils/wrapAsync.js");

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);

const sessionOptions = {
    secret:"mysecretcode",
    resave:"false",
    saveUninitialized:true,
    cookie: {
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true
    },
};

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

main()
.then(()=>{
    console.log("connection Succesful");
})
.catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/voyagevista');
};

// app.get("/",(req,res)=>{
//     res.send("Main Page");
// });

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);



// Contact us
app.get("/contactus",(req,res)=>{
    res.render("./listings/contact.ejs");
});

app.get('/search',async (req,res)=>{
    let { search } = req.query;
    let allListing = await Listing.find({});
    let allListings = allListing.filter((el) => {
        const matchesTitle = el.title.toLowerCase().startsWith(search.toLowerCase());
        const matchesCountry = el.country.toLowerCase().startsWith(search.toLowerCase());
        const matchesLocation = el.location.toLowerCase().startsWith(search.toLowerCase());
        return matchesTitle || matchesCountry || matchesLocation;
    });
    res.render('listings',{allListings});
});

app.get("/filter/:category", wrapAsync(async (req, res) => {
    const { category } = req.params; 
    let filteredListings = await Listing.find({ category: category });
    if (!filteredListings) {
        filteredListings = [];
    }
    res.render("listings", { allListings: filteredListings });
}));


app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"));
});
// Error Handling
app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something Went Wrong"} = err;
    res.status(statusCode).render("error.ejs",{message});
});

app.listen(8080,()=>{
    console.log("server is listening to port 8080");
});
















//      app.get("/listing",async (req,res)=>{
    //     let samplelisting = new Listing({
    //         title : "Mansion",
    //         description : "nearby beach",
    //         price : 5000,
    //         location : "Krishna nagar,Mathura",
    //         country : "India",
    //     });
    //     await samplelisting.save();
    //     console.log("Saved Successfully");
    //     res.send("Success");
    // });