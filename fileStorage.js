const AWS = require("aws-sdk");
AWS.config.update({
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
  region: process.env.region,
});


const s3 = new AWS.S3({ endpoint: process.env.endpoint });

// async function uploadFileToS3(file) {
exports.uploadFileToS3 = async (file) => {
  const uploadParams = {
    Bucket: process.env.Bucket_Name,
    Key: file.originalname,
    Body: file.buffer,
    ContentType: file.mimetype,
    // ACL: 'public-read',
  };
  const result = await s3.upload(uploadParams).promise();
  return result.Location;
};
const Bucket_Name = process.env.Bucket_Name;
exports.multiPart = async (file) => {
  try {
    console.log(1);
    const fileData = file.buffer;
    const Object_Key = file.originalname;
    const uploadParams = {
      Bucket: Bucket_Name,
      Key: Object_Key,
    };
    console.log(2);

    const { UploadId } = await s3.createMultipartUpload(uploadParams).promise();
    console.log(3);

    const partSize = 0.5 * 1024 * 1024; // 5MB part size (adjust as needed)
    const numParts = Math.ceil(fileData.length / partSize);
    const parts = [];
    console.log(4, numParts);
    for (let i = 0; i < numParts; i++) {
      console.log("here");
      const start = i * partSize;
      const end = Math.min(start + partSize, fileData.length);
      const partData = fileData.slice(start, end);
      console.log("here1", partData);

      const uploadPartParams = {
        Bucket: Bucket_Name,
        Key: Object_Key,
        PartNumber: i + 1,
        UploadId: UploadId,
        Body: partData,
      };
      console.log("here2");

      const part = await s3.uploadPart(uploadPartParams).promise();
      console.log("here3", part);
      parts.push({ PartNumber: i + 1, ETag: part.ETag });
    }
    console.log(5);

    await s3
      .completeMultipartUpload({
        Bucket: Bucket_Name,
        Key: Object_Key,
        UploadId: UploadId,
        MultipartUpload: { Parts: parts },
      })
      .promise();
    console.log(6);

    console.log("Video uploaded to S3 successfully.");

    // Step 2: Generate the S3 URL
    return `https://${Bucket_Name}.s3.amazonaws.com/${Object_Key}`;
  } catch (error) {
    console.error("Error during file upload:", error);
    res.status(500).json({ error: "Error during file upload." });
  }
};
