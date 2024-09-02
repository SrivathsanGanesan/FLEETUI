const eventStreamHeader = {
  "Content-Type": "text/event-stream",
  "Cache-Control": "no-cache",
  Connection: "keep-alive",
};
//..

const throughput = async (req, res, next) => {
  const mapId = req.params.mapId;
  try {
    //..
    return res.status(200).json({
      msg: "data sent",
      throughput: {
        Stat: [
          {
            TotalNumberRobots: 5,
            TotalTimeElasped: 3600,
            TotalTaskCount: 100,
            TotalThroughPutPerHour: 50,
          },
          {
            TotalNumberRobots: 4,
            TotalTimeElasped: 3600,
            TotalTaskCount: 90,
            TotalThroughPutPerHour: 22.5,
          },
          {
            TotalNumberRobots: 5,
            TotalTimeElasped: 3600,
            TotalTaskCount: 100,
            TotalThroughPutPerHour: 35,
          },
          {
            TotalNumberRobots: 5,
            TotalTimeElasped: 3600,
            TotalTaskCount: 100,
            TotalThroughPutPerHour: 45,
          },
        ],
        InProgress: 10,
      },
    });
  } catch (err) {
    console.log("eventStream error occured : ", err);
    res.status(500).json({ opt: "failed", error: err });
  }
};

module.exports = { throughput };
