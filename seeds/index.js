if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

const path = require("node:path");

const mongoose = require("mongoose");

const Campground = require(path.join(__dirname, "../models/campground"));
const Review = require(path.join(__dirname, "../models/review"));
const User = require(path.join(__dirname, "../models/user"));

const cities = require(path.join(__dirname, "cities"));
const { places, descriptors } = require(path.join(__dirname, "seedHelpers"));

const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/yelp-camp";

mongoose.connect(dbUrl)
    .then(() => console.log("Database connected."))
    .catch(err => console.log(`Connection error: ${err}.`));

const db = mongoose.connection;

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await User.deleteMany({});
    console.log("Previous users deleted.");
    const admin = new User({ email: "admin@gmail.com", username: "admin" });
    const registeredAdmin = await User.register(admin, "admin");
    console.log("Admin created and saved to the database.");

    await Review.deleteMany({});
    console.log("Previous reviews deleted.");
    await Campground.deleteMany({});
    console.log("Previous campgrounds deleted.");

    const save_promises = [];

    for (let i = 0; i < 200; i++) {
        const random_city = sample(cities);
        const price = Math.floor(Math.random() * 20) + 10;

        const camp = new Campground({
            author: `${registeredAdmin._id}`,
            location: `${random_city.city}, ${random_city.state}`,
            geometry: {
                type: "Point",
                coordinates: [random_city.longitude, random_city.latitude]
            },
            title: `${sample(descriptors)} ${sample(places)}`,
            image: `https://picsum.photos/400?random=${Math.random()}`,
            description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quasi iusto dolorum quia recusandae inventore eligendi, illum illo dignissimos, alias corrupti labore natus laborum, odio eum. Consequatur maiores atque repellat dignissimos.",
            price,
            images: [
                {
                    url: 'https://res.cloudinary.com/dmcimg4lu/image/upload/v1737998466/YelpCamp/viswiqagdpt1rmjfzebh.jpg',
                    filename: 'YelpCamp/viswiqagdpt1rmjfzebh'
                },
                {
                    url: 'https://res.cloudinary.com/dmcimg4lu/image/upload/v1737998467/YelpCamp/barcqz9dlvylvbyi19rt.jpg',
                    filename: 'YelpCamp/barcqz9dlvylvbyi19rt'
                },
                {
                    url: 'https://res.cloudinary.com/dmcimg4lu/image/upload/v1737998467/YelpCamp/pkpkefbbufat1smmhocn.jpg',
                    filename: 'YelpCamp/pkpkefbbufat1smmhocn'
                }
            ]
        });
        save_promises.push(camp.save());
    }

    await Promise.all(save_promises);
    console.log("All campgrounds have been saved to the database.");
};

seedDB().then(() => {
    db.close();
});