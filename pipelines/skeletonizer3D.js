/* 
Pipeline for grouping documents in the skeletonizer3d collection by timecode.

OPERATES ON
skeletonizer3d collection

DESCRIPTION
The collection collects pairs of documents, one with the skeleton joints, one
 with the point cloud data. This pipeline merges the documents sharing the same
 timecode into a single document with the data field embedded in the message
 object.
*/
[
  {
    // Match documents with a timecode field
    // Note that _id becomes the timecode
    $group: {
      _id: "$message.timecode",
      message: {
        $mergeObjects: "$message"
      },
      data: {
        $mergeObjects: "$$ROOT"
      }
    }
  },
  {
    // Embed the data field in the message object
    $addFields: {
      "message.data": "$data.data"
    }
  },
  {
    // only select the _id and message fields
    $project: {
      _id: 1,
      message: 1
    }
  }
]