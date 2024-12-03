const { getIPRange } = require("get-ip-range");
// const NetworkScanner = require("network-scanner-js");
// const netScan = new NetworkScanner();
const arp = require("node-arp");
const dns = require("dns");

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

// need to use dhcp server to resolve hostname by ip.. in later.. instead of reverse loopup on dns server or local dns server..!
const getHost = (ip) => {
  if (ip === "") return;
  return new Promise((resolve, reject) => {
    dns.reverse(ip, (err, hostnames) => {
      // process of reverse DNS lookup (with PTR record)..
      // console.log(hostnames);
      if (err) resolve(`could not resolve hostname`);
      // if (err) resolve(err.hostname);
      if (!err && hostnames?.length !== 0) resolve(hostnames[0]);
      else if (hostnames?.length === 0) resolve(`No hostname found`);
    });
  });
};

const scanIp = async (req, res) => {
  const { startIp, endIp } = req.params;
  try {
    const ipRange = getIPRange(`${startIp}-${endIp}`); // "192.168.24.90-192.168.36.183"
    /* req.on("close", () => {
      console.log("Client closed the connection, in the way of scanning  ip.");
      return res.end();
    }); */

    res.writeHead(200, eventStreamHeader);
    for (let ip of ipRange) {
      try {
        const poll = await netScan.poll(ip, {
          repeat: null,
          size: 32,
          timeout: null,
        });
        let mac = "";
        let hostName = "";
        if (poll.status === "online") mac = await getMacAddress(ip);
        hostName = await getHost(ip);

        const netPoll = JSON.stringify({
          ip_address: poll.ip_address,
          mac_address: mac === undefined ? "undefined" : mac,
          host: hostName,
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
    console.error("Error occurred in SSE :", error.message); // consider "error" as an obj of Error class for next time..
    if (error.message && error.message.includes("Too many IPs in range"))
      return res.status(422).json({ msg: "Ip range too hight" });
    res.status(500).send("Internal Server Error, might Ip range is so High!");
  }
};

module.exports = { scanIp };
