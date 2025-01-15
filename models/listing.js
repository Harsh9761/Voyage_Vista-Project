const mongoose = require("mongoose");
const schema = mongoose.Schema;
const Review = require("./reviews.js")

const listingSchema = new schema({
    title : {
        type : String,
        required : true
    },
    description : String,
    image : {
        type : String,
        default : "https://images.unsplash.com/photo-1729538730561-2122c58809f0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1M3x8fGVufDB8fHx8fA%3D%3D",
        set : (v) =>
            v===""?"https://images.unsplash.com/photo-1729538730561-2122c58809f0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1M3x8fGVufDB8fHx8fA%3D%3D"
            : v,
    },
    price : {
        type:Number,
        required : true
    },
    location : {
        type: String,
        required : true
    },
    country : {
        type : String,
        required : true
    },
    category: {
        type: String,
        enum: ["trending", "Rooms", "Cities", "Mountains", "Snow", "Mansion","Amazing pools","Farms", "Camping"],
        required: true
    },
    reviews:[{
        type: schema.Types.ObjectId,
        ref: 'Review'
    }],
    owner:{
        type: schema.Types.ObjectId,
        ref: 'User'
    },
    geometry:{
        type: {
          type: String, 
          enum: ['Point'],
          required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;