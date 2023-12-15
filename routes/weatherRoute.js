const router = require("express").Router();
const { request } = require("http");
const Locations = require('../models/Location');
const axios = require('axios');

 





//post req from front-end with lat and lon 
//if present in location-database, then it will get data from open-weather
//other-wise,give an error message.
router.post('/weather/loc', async (req, res) => {

    try {
        const{lat,lon} = req.body;
        console.log(lat)
        //2 things will come from front-end [userId, productId]

        //I am checking if the id entered by user is in database or not
        //If "yes", then continue.
        if (!lat || !lon) {
            return res.send({
                message: "query is not provided",
                success: false
            })
        }
        const checkname = await Locations.findOne({ lat:lat,lon:lon});
        console.log(checkname)

        // const existingData = localStorage.getItem('data');
        // if(existingData){
        //     let requireddata=existingData.map((item)=>{
        //         if(item.lat===lat && item.lon===lon){
        //             return item;
        //         }
        //     })
        //     if(requireddata){
        //         return res.send({
        //             message:"data fetched in local-itself",
        //             data:requireddata
        //         })
        //     }
        // }

        if (!checkname) {
            res.send({
                message: "Location not found in db. Add it to db first",
                success: false
            })
        }
        const realtime = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPEN_WEATHER_MAP_API_KEY}`
        );
        const requireddata={
            temp:realtime.data.main.temp,
            pressure:realtime.data.main.pressure,
            humidity:realtime.data.main.humidity,
            lat:lat,
            lon:lon
        }
        // if(requireddata){
            
        //     let dataArray = existingData ? JSON.parse(existingData) : [];
        //     dataArray.push(requireddata);
        // }
        console.log("Hello World!")
        console.log(realtime);
        res.send({
            success: true,
            message: "Data searched success",
            data:requireddata

        })
    } catch (err) {

        res.send({
            message: err.message,
            success: false  //fase-->false
        })
    }
})



//user can access the data based on location as well.

router.post('/weather/name', async (req, res) => {

    try {
        const{loc} = req.body;
        // console.log(lat)
        //2 things will come from front-end [userId, productId]

        //I am checking if the id entered by user is in database or not
        //If "yes", then continue.
        if (!loc) {
            return res.send({
                message: "query is not provided",
                success: false
            })
        }
        const check = await Locations.findOne({ name:loc});
        console.log(check)

        // const existingData = localStorage.getItem('data');
        // if(existingData){
        //     let requireddata=existingData.map((item)=>{
        //         if(item.lat===lat && item.lon===lon){
        //             return item;
        //         }
        //     })
        //     if(requireddata){
        //         return res.send({
        //             message:"data fetched in local-itself",
        //             data:requireddata
        //         })
        //     }
        // }
        

        if (!check) {
            res.send({
                message: "Location not found in db. Add it to db first",
                success: false
            })
        }
        const realtime = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${check.lat}&lon=${check.lon}&appid=${process.env.OPEN_WEATHER_MAP_API_KEY}`
        );
        const requireddata={
            temp:realtime.data.main.temp,
            pressure:realtime.data.main.pressure,
            humidity:realtime.data.main.humidity,
        }
        // if(requireddata){
            
        //     let dataArray = existingData ? JSON.parse(existingData) : [];
        //     dataArray.push(requireddata);
        // }
        // console.log("Hello World!")
        // console.log(realtime);
        res.send({
            success: true,
            message: "Data searched success",
            data:requireddata

        })
    } catch (err) {

        res.send({
            message: err.message,
            success: false  //fase-->false
        })
    }
})





module.exports = router;