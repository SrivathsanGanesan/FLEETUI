const { getIPRange } = require("get-ip-range");
const NetworkScanner = require("network-scanner-js");
// const nmap = require("libnmap");
const netScan = new NetworkScanner();
const arp = require("node-arp");
const ping = require("ping"); //..
const ipRangeCheck = require("ip-range-check"); //..

const scanIp = async (req, res, next) => {
  let arr = [];
  const ipv4Range = getIPRange("52.95.110.0-52.95.110.200");

  const ipRange = [
    "192.168.249.3",
    "192.168.249.183",
    "192.168.249.248",
    "142.250.182.46",
  ]; // Add your IP range
  for (let ip of ipRange) {
    const poll = await netScan.poll(ip, {
      //192.168.249.183
      repeat: null,
      size: 32,
      timeout: null,
    });
    arp.getMAC(ip, (err, mac) => {
      if (!err) {
        arr.push(mac);
        console.log(mac);
      }
    });
    // arr.push({
    //   host: poll.host,
    //   ip_address: poll.ip_address,
    //   status: poll.status,
    //   time: poll.res_avg,
    // });
  }

  res.json(arr);
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
