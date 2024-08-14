const { getIPRange } = require("get-ip-range");
const NetworkScanner = require("network-scanner-js");
const netScan = new NetworkScanner();
const arp = require("node-arp");

const eventStreamHeader = {
  "Content-Type": "text/event-stream",
  "Cache-Control": "no-cache",
  Connection: "keep-alive",
};

const scanIp = async (req, res, next) => {
  let arr = [];
  const ipv4Range = getIPRange("192.168.249.3-192.168.249.248");
  const macPromises = ipv4Range.map((ip) => {
    return new Promise((resolve, reject) => {
      arp.getMAC(ip, (err, mac) => {
        if (err) {
          reject(err); // Reject promise on error
        } else {
          resolve(mac); // Resolve promise with MAC address
        }
      });
    });
  });

  const ipRange = [
    "192.168.249.3",
    "192.168.249.183",
    "192.168.249.248",
    "142.250.182.46",
  ]; // Add your IP range
  res.writeHead(200, eventStreamHeader);
  for (let ip of ipRange) {
    const poll = await netScan.poll(ip, {
      //192.168.249.183
      repeat: null,
      size: 32,
      timeout: null,
    });
    const netPoll = JSON.stringify({
      host: poll.host,
      ip_address: poll.ip_address,
      status: poll.status,
      time: poll.res_avg,
    });
    res.write(`data: ${netPoll}\n\n`);
  }
  const macAddresses = await Promise.all(macPromises);
  console.log(macAddresses);
  res.end();

  res.on("close", () => {
    return res.end();
  });

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
