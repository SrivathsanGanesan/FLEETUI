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
  return new Promise((resolve, reject) => {
    arp.getMAC(ip, (err, mac) => {
      resolve(mac);
    });
  });
};

const scanIp = async (req, res, next) => {
  let arr = [];
  const ipv4Range = getIPRange("192.168.36.90-192.168.36.183");

  const ipRange = [
    "192.168.249.3",
    "192.168.249.183",
    "192.168.249.248",
    "142.250.182.46",
  ]; // Add your IP range
  res.writeHead(200, eventStreamHeader);
  for (let ip of ipRange) {
    try {
      const poll = await netScan.poll(ip, {
        //192.168.249.183
        repeat: null,
        size: 32,
        timeout: null,
      });
      let mac = "";
      if (poll.status === "online") mac = await getMacAddress(ip);
      const netPoll = JSON.stringify({
        // host: poll.host,
        ip_address: poll.ip_address,
        mac_address: mac === undefined ? "undefined" : mac,
        status: poll.status,
        time: poll.res_avg,
      });
      console.log(netPoll);
      res.write(`data: ${netPoll}\n\n`);
    } catch (error) {
      res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    }
  }
  res.end();

  // res.on("close", () => { // if want
  //   return res.end();
  // });

  // res.json(arr);
};

module.exports = { scanIp };

/* for (let ip of ipRange) {
  ping.promise.probe(ip).then((res) => {
    arr.push({ host: res.host, alive: res.alive, time: res.time });
    console.log(
      `${res.host}: ${res.alive ? "alive" : "dead"} time: ${res.time}ms`
    );
  });
} */
