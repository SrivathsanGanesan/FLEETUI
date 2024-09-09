const { Map, Robo } = require("../../../application/models/mapSchema");
const fleetTasks = {
  tasks: [
    {
      task_id: "task_001",
      agent_ID: "AMR 2",
      agent_name: "Robot A",
      task_status: {
        status: "In Progress",
        color: "#E19F26",
      },
      sub_task: [
        {
          source_location: "Location A",
          task_Add_Time: "1694092800",
          task_Complete_Time: "1694096400",
          task_type: "Pickup",
        },
        {
          source_location: "Location B",
          task_Add_Time: "1694096500",
          task_Complete_Time: "1694100000",
          task_type: "Dropoff",
        },
      ],
    },
    {
      task_id: "task_002",
      agent_ID: "AMR 3",
      agent_name: "Robot B",
      task_status: {
        status: "Completed",
        color: "#E19F26",
      },
      sub_task: [
        {
          source_location: "Location C",
          task_Add_Time: "1694100100",
          task_Complete_Time: "1694103600",
          task_type: "Transport",
        },
      ],
    },
  ],
  default_columns: [
    "task_id",
    "agent_ID",
    "agent_name",
    "task_status",
    "sub_task",
  ],
  messageText: "ACCEPTED",
  errorCode: 100,
};

const getFleetTask = (req, res, next) => {
  fetch(`http://fleetIp:8080/fms/amr/get_tasks_list`, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({ timeStamp1: "", timeStamp2: "" }),
  })
    .then((response) => {
      if (!response.ok) {
        req.responseStatus = "NOT_OK";
        return next();
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      req.fleetData = data;
    })
    .catch((err) => {
      req.fleetErr = err;
    });
  next();
};

const getTasks = async (req, res) => {
  const mapId = req.params.mapId;
  try {
    //..
    let taskData = req.fleetData;
    let isMapExists = await Map.exists({ _id: mapId });
    if (!isMapExists)
      return res.status(500).json({ msg: "map not exists", map: null });
    // Needed one!
    /* const mapData = await Map.findOneAndUpdate(
      { _id: mapId },
      {
        $push: {
          tasks: { $each: fleetTasks.tasks }, // can push multiple entries to the array using $each
        },
      }
      // { new: true } // which returns the updated document of the Map..
    ); */

    return res.status(200).json({
      msg: "data sent",
      tasks: fleetTasks.tasks,
    });
  } catch (err) {
    console.log("error occured : ", err);
    if (err.name === "CastError")
      return res.status(400).json({ msg: "not valid map Id" });
    res.status(500).json({ opt: "failed", error: err });
  }
};

module.exports = { getFleetTask, getTasks };
