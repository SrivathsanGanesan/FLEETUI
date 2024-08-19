const { getIPRange } = require("get-ip-range");
const NetworkScanner = require("network-scanner-js");
const netScan = new NetworkScanner();
const arp = require("node-arp");

const eventStreamHeader = {
  "Content-Type": "text/event-stream",
  "Cache-Control": "no-cache",
  Connection: "keep-alive",
};

const getMacAddress = (ip) => {
  if (ip === "") return;
  return new Promise((resolve, reject) => {
    arp.getMAC(ip, (err, mac) => {
      resolve(mac);
    });
  });
};

const scanIp = async (req, res) => {
  const { startIp, endIp } = req.params;
  try {
    // let arr = [];
    const ipRange = getIPRange(`${startIp}-${endIp}`); // "192.168.24.90-192.168.36.183"

    res.writeHead(200, eventStreamHeader);
    for (let ip of ipRange) {
      try {
        const poll = await netScan.poll(ip, {
          repeat: null,
          size: 32,
          timeout: null,
        });
        let mac = "";
        if (poll.status === "online") mac = await getMacAddress(ip);

        const netPoll = JSON.stringify({
          ip_address: poll.ip_address,
          mac_address: mac === undefined ? "undefined" : mac,
          host: poll.host,
          status: poll.status,
          time: poll.res_avg,
        });
        // console.log(netPoll);
        res.write(`data: ${netPoll}\n\n`);
      } catch (error) {
        res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
      }
    }
    res.end();
  } catch (error) {
    console.error("Error occurred in SSE :", error);
    res.status(500).send("Internal Server Error, might Ip range is so High!");
  }
};

module.exports = { scanIp };
