const { default: axios } = require("axios");
const cronJob = require("../models/cronJob");
const cron = require('node-cron');
const { sendEmailHelper } = require("../service/sendMail");
const { validateCronJob } = require("../validation/cronJob");

const getCronJobList = async (req, res) => {

  try {
    const cronJobs = await cronJob
      .find(filter)
      .sort({ updatedAt: -1 })

    return res.status(200).send({
      isSuccess: true,
      message: "Cron Job History listing successfully",
      data: cronJobs,
    });
  } catch (error) {
    return res.status(203).send({
      error: error.message,
      message: "Something went wrong, please try again!",
      isSuccess: false,
    });
  }
}
const createCronJob = async (req, res) => {

  try {
    let { apiURL, time } = req?.body;

    validateCronJob(req, res)

    const schedule = await cronJob.findOne({
      apiURL, isResolved: false
    });
    if (schedule) {
      return res
        .status(203)
        .send({ message: "Cron job already exits!", isSuccess: false });
    }

    req.body.userId = req?.user?.userId
    const create = await cronJob(req?.body);
    create
      .save()
      .then(async (timer) => {
        // scheduleCronJob(req?.body, timer._id)
        return res.status(200).send({
          message: "Schedule created successfully.",
          data: timer,
          isSuccess: true,
        });
      })
      .catch((error) => {
        return res.status(203).send({
          error: error.message,
          message: "Something went wrong, please try again!",
          isSuccess: false,
        });
      });

  } catch (error) {
    console.log('error :>> ', error);
    // return res.status(203).send({
    //   error: error.message,
    //   message: "Something went wrong, please try again!",
    //   isSuccess: false,
    // });
  }
}

const scheduleCronJob = async (schedule, cronJobId, cronRunning) => {

  try {
    let cronTime;
    let [hour, minute, second] = schedule?.time.split(":");
    if (hour > 0) {
      cronTime = `${second} ${minute} */${hour} * * *`;
    } else if (hour == 0 && minute > 0) {
      cronTime = `0 */${minute} * * * *`;

    } else if (minute == 0 && hour == 0) {
      cronTime = `*/${second} * * * * *`;
    }
    // cronTime = cronTime[1] + " " + cronTime[1] + " " + cronTime[0] + " " + "* * *";
    // cronTime =cronTime[1] + " " + cronTime[0] + " " + "* * *";



    cron.schedule(cronTime, async () => {

      if (schedule && !cronRunning[cronJobId]) {
        try {
          cronRunning[cronJobId] = true
          const config = {
            method: schedule?.method,
            url: schedule?.apiURL,
            headers: JSON.parse(schedule?.header?.replace(/(\w+):/g, '"$1":')),
            data: JSON.parse(schedule?.body?.replace(/(\w+):/g, '"$1":'))
          }
          const apidata = await axios(config).then(res => res).catch(err => err?.response)
          console.log("cron.schedule ~ apidata:", apidata)
          if (!schedule?.statusCode?.includes(apidata?.status)) {
            const emailsent = await sendEmailHelper(
              schedule?.email,
              "API Error",
              `<table width="100%" border="0" align="center" cellpadding="7" cellspacing="0" bgcolor="#ffffff"
                style="font-family:Arial;   font-size: 13px; margin:0px auto;">
                <tr>
                    <td style="padding:20px">
                        <table align="center" border="0" cellpadding="15" cellspacing="0" width="600px">
                            <tbody>
                                <tr style="background:black;;">
                                    <td valign="top" width="50%"
                                        style="border-bottom:1px solid #eee;font-size:20px;color:#fff; font-weight:bold; text-align: center; ">
                                        <h2>Status APP</h2>
                                    </td>
                                </tr>
                                <tr bgcolor="#ffffff">
                                    <td style="font-family:arial; font-size:15px; border:1px solid #ffffff; color:#333;">
                                        <h3>Hi there,</h3>
                                        <p>Error occured in below api for ${schedule?.method}</p>
                                        <h2>
                                            ${schedule?.apiURL}
                                        </h2>
                                        <p><b>Status: ${apidata?.status}</b></p>
                                        <p><b>Error: ${apidata?.statusText}. ${apidata?.data?.message || ""}. ${apidata?.data?.error || ""}</b></p>
                                        <br>
                                        <p>Regards,<br />Team</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 16px;" valign="top" align="center" bgcolor="black">
                                        <table cellspacing="0" cellpadding="0" border="0" align="center">
                                            <tbody>
                                                <tr>
                                                    <td style="font-family: 'Arial', sans-serif; font-size: 13px; ; line-height: 20px; font-weight: normal; color: #ffffff;"
                                                        valign="top" align="left">
                                                        © ${new Date().getFullYear()} Powered by  Team
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </table>`)

            // setTimeout(() => {
            cronRunning[cronJobId] = false
            // }, 60000)
          } else {
            await cronJob.updateOne({ _id: cronJobId }, { $set: { isResolved: true } })
          }

        } catch (error) {
          console.log("cron.schedule ~ error:", error)
          return error
        }
      }
    });

  } catch (error) {
    console.log("scheduleCronJob ~ error:", error)
    return error
  }
}


module.exports = {
  getCronJobList, createCronJob, scheduleCronJob
}