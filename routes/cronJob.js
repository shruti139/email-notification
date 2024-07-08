var express = require('express');
var router = express.Router();
const cron = require('node-cron');
const cronJob = require('../models/cronJob');
const { getCronJobList, createCronJob, scheduleCronJob } = require('../controller/cronJob');
const { validateCronJob } = require('../validation/cronJob');
/* GET users listing. */
router.get('/cronJob',getCronJobList);
router.post('/createCronJob',createCronJob);

var cronRunning = {}

cron.schedule(`* * * * * *`, async() => {
    console.log('running a task every  seconds');
    const allCronJobs = await cronJob.find({isResolved:false})
    allCronJobs.forEach(async (cronJob) => {
        await  scheduleCronJob(cronJob,cronJob?._id,cronRunning)
        
    })
});


module.exports = router;
