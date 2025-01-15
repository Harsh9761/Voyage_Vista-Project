const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {listingSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const {isLoggedIn} = require("../middleware.js");

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


// Schema Validation
const validatelisting = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errmsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errmsg);
    } else{
        next();
    }
}

// Index Route
router.get("/",wrapAsync( async (req,res)=>{
    let allListings = await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
}));

//New Route
router.get("/new",isLoggedIn,(req,res)=>{
    
    res.render("./listings/new.ejs");
});
//Create Route
router.post("/",validatelisting,wrapAsync(async (req,res)=>{
    let coordinates = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
        .send()
    
    // console.log(coordinates.body.features[0].geometry);
    const newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;
    newlisting.geometry = coordinates.body.features[0].geometry;
    await newlisting.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
}));

// Edit Route
router.get("/:id/edit",isLoggedIn,wrapAsync( async (req,res)=>{
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing does not Exists!");
        res.redirect("/listings");
    }
    res.render("./listings/edit.ejs",{listing});
}));

// Update Route
router.put("/:id",isLoggedIn,validatelisting,wrapAsync(async (req,res)=>{
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success","Listing Edited!");
    res.redirect(`/listings/${id}`);
}));

//Show Route
router.get("/:id",wrapAsync(async (req,res)=>{
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listing){
        req.flash("error","Listing does not Exists!");
        res.redirect("/listings");
    }
    res.render("./listings/show.ejs",{listing});
}));

//Delete Route
router.delete("/:id",isLoggedIn,wrapAsync(async (req,res)=>{
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted Successfully!");
    res.redirect("/listings");
}));


module.exports = router;