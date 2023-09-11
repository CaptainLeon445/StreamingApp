const cache = require('memory-cache');

let data;
exports.getDataFromCache=async (key, Data)=>{
  data = await cache.get(key);
  if (data) {
    console.log("hello")
    return data;
  }
  console.log("hello here")
 
  // Store data in cache for future use
  await cache.put(key, Data, 3600000); // Cache for 1 hour
  data = Data
  return data
}