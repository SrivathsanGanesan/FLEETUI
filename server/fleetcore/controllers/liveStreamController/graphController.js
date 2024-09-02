// -------- [WIP] --------------

const eventStreamHeader = {
  "Content-Type": "text/event-stream",
  "Cache-Control": "no-cache",
  Connection: "keep-alive",
};

const throughput = async (req, res, next) => {
  const mapId = req.params.mapId;
  try {
    //..
    res.writeHead(200, eventStreamHeader);
    const fuse = setInterval(async () => {
      const coor = JSON.stringify({
        data_x: Math.floor(Math.random() * 20),
        data_y: Math.floor(Math.random() * 150),
      });
      res.write(`data: ${coor}\n\n`);
    }, 1000 * 1.5);

    res.on("close", () => {
      clearInterval(fuse);
      res.end();
    });
  } catch (err) {
    console.log("eventStream error occured : ", err);
    res.status(500).json({ opt: "failed", error: err });
  }
};

module.exports = { throughput };
