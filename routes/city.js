//import express, which helps us handle our requests.
const express = require("express");
//inport Router() method from express which give us the ability to manage different routes, with different end points, with different http words
const router = express.Router();

//import knex and connect it to our sqlite database
//first, import the knex configuration json
const knexConfig = require("../knexConfig.json");
//then import and configure knex with the json above
const knex = require("knex")(knexConfig);


router.get('/', function (req, res, next) {
    knex.select().table("cities")
        .then(docs => {
            const response = {
                count: docs.length,
                city: docs.map(doc => {
                    return {
                        name: doc.name,
                        id: doc.id,
                        scores: {
                            walkability: doc.walk,
                            job_growth: doc.jobs,
                            green_space: doc.green,
                            taxes: doc.taxes,
                        },
                        request: {
                            type: "GET",
                            url: "http://localhost:3000/city/" + doc.id
                        }
                    };
                })
            };
            if (docs.length >= 0) {
                res.status(200).json(response);
            } else {
                res.status(400).json({
                    error: 'No entries found'
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.get('/:CityID', function (req, res, next) {
    const _id = req.params.CityID;
    knex.select().table("cities").where({ id: _id })
        .then(doc => {
            const response = {
                name: doc[0].name,
                id: doc[0].id,
                scores: {
                    walkability: doc[0].walk,
                    job_growth: doc[0].jobs,
                    green_space: doc[0].green,
                    taxes: doc[0].taxes,
                },
                request: {
                    type: "GET",
                    url: "http://localhost:3000/city/" + doc[0].id
                }
            };
            if (doc.length > 0) {
                res.status(200).json(response);
            } else {
                res.status(400).json({
                    error: "No city with id '" + _id + "'"
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err,
            });
        });
});

module.exports = router;