// import rateLimit from 'express-rate-limit';

// export const rateLimiterUsingThirdParty = rateLimit({
//   windowMs: 24 * 60 * 60 * 1000, // 24 hrs in milliseconds
//   max: 100,
//   message: 'You have exceeded the 100 requests in 24 hrs limit!', 
//   standardHeaders: true,
//   legacyHeaders: false,
// });


import { createClient } from "redis";
import moment from "moment";
import { CustomRequest } from "../interfaces/express.generic";
import { Response, NextFunction } from "express";

interface RedisRequestRecord {
  requestTimestamp : number,
  requestCount: number
}

const redisClient = createClient();
redisClient.connect();
redisClient.on("error",(err)=> console.log("Redis client error: ", err));

const WINDOW_SIZE_IN_HOURS = 24;
const MAX_WINDOW_REQUEST_COUNT = 5;
const WINDOW_LOG_INTERVAL_IN_HOURS = 1;

export const customRedisRateLimiter = async(req:CustomRequest, res:Response, next:NextFunction)=>{
  try{
    if(!redisClient){
      throw new Error("Redis client doesn't exist.")
    }
    const currentRequestTime = moment();
    const record = await redisClient.get(req.userId as string);
    if(!record){
      const newRecord:RedisRequestRecord[] = [];
      const requestLog:RedisRequestRecord = {
        requestTimestamp : currentRequestTime.unix(),
        requestCount : 1
      }
      newRecord.push(requestLog);
      await redisClient.set(req.userId as string, JSON.stringify(newRecord));
      next();
    }
    const data = JSON.parse(record as string);
    console.log(data);
    const windowStartTimestamp = moment().subtract(WINDOW_SIZE_IN_HOURS, "hours").unix();
    const requestsWithinWindow = data.filter((entry: RedisRequestRecord)=>{
      return entry.requestTimestamp > windowStartTimestamp;
    })
    console.log('requestsWithinWindow', requestsWithinWindow);
    const totalWindowRequestsCount = requestsWithinWindow.reduce((accumulator:number, entry:RedisRequestRecord) => {
      return accumulator + entry.requestCount;
    }, 0);
    // if number of requests made is greater than or equal to the desired maximum, return error
    if (totalWindowRequestsCount >= MAX_WINDOW_REQUEST_COUNT) {
      res.status(429).send(`You have exceeded the ${MAX_WINDOW_REQUEST_COUNT} requests in ${WINDOW_SIZE_IN_HOURS} hrs limit!`);
    } else {
      // if number of requests made is less than allowed maximum, log new entry
      const lastRequestLog = data[data.length - 1];
      const potentialCurrentWindowIntervalStartTimeStamp = currentRequestTime.subtract(WINDOW_LOG_INTERVAL_IN_HOURS, 'hours').unix();
      //  if interval has not passed since last request log, increment counter
      if (lastRequestLog.requestTimeStamp > potentialCurrentWindowIntervalStartTimeStamp) {
        lastRequestLog.requestCount++;
        data[data.length - 1] = lastRequestLog;
      } else {
        //  if interval has passed, log new entry for current user and timestamp
        data.push({
          requestTimeStamp: currentRequestTime.unix(),
          requestCount: 1,
        });
      }
      await redisClient.set(req.userId as string, JSON.stringify(data));
      next();
    }
  }
  catch(err){
    const error = err as Error;
    console.log(error.message);
    return res.status(500).json({message: "Internal Server Error."})
  }
}