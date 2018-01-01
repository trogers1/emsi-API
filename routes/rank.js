//import express, which helps us handle our requests.
const express = require("express");
//inport Router() method from express which give us the ability to manage different routes, with different end points, with different http words
const router = express.Router();

//import knex and connect it to our sqlite database
//first, import the knex configuration json
const knexConfig = require("../knexConfig.json");
//then import and configure knex with the json above
const knex = require("knex")(knexConfig);


router.post('/', function (req, res, next) {
    let weights;
    try {
        weights = new Object({
            walkability: req.body.weights.walkability, //same here for walkability, job growth, green space, and taxes
            job_growth: req.body.weights.job_growth,
            green_space: req.body.weights.green_space,
            taxes: req.body.weights.taxes
        });
    }
    catch (err) {
        res.status(400).json({
            error: "The incorrect json was supplied",
            missing: "Could not find 'weights' in any supplied json"
        });
    }

    console.log("walkability weight: " + weights.walkability);
    console.log("job_growth weight: " + weights.job_growth);
    console.log("green_space weight: " + weights.green_space);
    console.log("taxes weight: " + weights.taxes);
    if (!weights.walkability || !weights.job_growth
        || !weights.green_space || !weights.taxes) {
        let missing_ = []
        if (!weights.walkability) {
            missing_.push("walkability");
        }
        if (!weights.job_growth) {
            missing_.push("job_growth");
        }
        if (!weights.green_space) {
            missing_.push("green_space");
        }
        if (!weights.taxes) {
            missing_.push("taxes");
        }
        res.status(400).json({
            error: "Not all weights were supplied",
            missing: missing_
        });
    }
    else //all are present
    {
        knex.raw('update cities set overall_score = (?? * ? + ?? * ? + ?? * ? + ?? * ?);', ['cities.walk', weights.walkability, 'cities.jobs', weights.job_growth, 'cities.green', weights.green_space, 'cities.taxes', weights.taxes])
            .then( docs => {
            knex('cities').orderBy('overall_score', 'desc')
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
                                    taxes: doc.taxes
                                },
                                // overall_score: doc.overall_score
                                //to round to at most 2 decimal places:
                                overall_score: Math.round(doc.overall_score * 100) / 100
                            };
                        })
                    };
                    if (docs.length > 0) {
                        res.status(200).json(response);
                    } else {
                        res.status(500).json({
                            error: "No response returned. Database error.'"
                        });
                    }
                })
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
    }
});

module.exports = router;