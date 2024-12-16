const { Map, Robo } = require("../../../application/models/mapSchema");

let tasks = [];
for (let i = 1; i < 100; i++) {
  tasks.push({
    task_id: `task_00${i}`,
    agent_ID: `AMR ${i}`,
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
  });
}

const getFleetTask = async (endpoint, bodyData) => {
  let response = await fetch(
    `http://${process.env.FLEET_SERVER}:${process.env.FLEET_PORT}/fms/amr/${endpoint}`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic cm9vdDp0b29y",
      },
      body: JSON.stringify(bodyData),
    }
  );

  return await response.json();
};

const taskOperation = async (endpoint, bodyData) => {
  let response = await fetch(
    `http://${process.env.FLEET_SERVER}:${process.env.FLEET_PORT2}/fms/amr/${endpoint}`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic cm9vdDp0b29y",
      },
      body: JSON.stringify(bodyData),
    }
  );

  return await response.json();
};

const getTasks = async (req, res) => {
  const { mapId, timeStamp1, timeStamp2 } = req.body;
  try {
    let isMapExists = await Map.exists({ _id: mapId });
    if (!isMapExists)
      return res.status(500).json({ msg: "map not exists", map: null });

    let bodyData = {
      timeStamp1: timeStamp1,
      timeStamp2: timeStamp2,
    };
    let tasks = await getFleetTask("get_tasks_list", bodyData); // make a look at here..
    return res.status(200).json({
      msg: "data sent",
      tasks: tasks,
    });
  } catch (err) {
    console.log("error occured : ", err);
    if (err.name === "CastError")
      return res.status(400).json({ msg: "not valid map Id" });
    res.status(500).json({ opt: "failed", error: err });
  }
};

const getCurrTasksActivities = async (req, res) => {
  const { mapId, timeStamp1, timeStamp2 } = req.body;
  try {
    let isMapExists = await Map.exists({ _id: mapId });
    if (!isMapExists)
      return res.status(500).json({ msg: "map not exists", map: null });

    let bodyData = {
      timeStamp1: timeStamp1,
      timeStamp2: timeStamp2,
    };

    let tasks = await getFleetTask("get_tasks_list", bodyData);

    if (tasks === undefined || !tasks.hasOwnProperty("tasks"))
      // (!("tasks" in tasks))
      return res
        .status(200)
        .json({ msg: "data sent, only with default columns", tasks: null });

    return res.status(200).json({
      msg: "data sent",
      tasks: tasks,
    });
  } catch (err) {
    console.log("error occured : ", err);
    if (err.name === "CastError")
      return res.status(400).json({ msg: "not valid map Id" });
    res.status(500).json({ opt: "failed", error: err });
  }
};

const getRobotUtilization = async (req, res) => {
  const { mapId, timeStamp1, timeStamp2 } = req.body;
  try {
    // Check if the map exists in the database
    let isMapExists = await Map.exists({ _id: mapId });
    if (!isMapExists)
      return res.status(500).json({ msg: "map not exists", map: null });

    // Prepare body data for the API call
    let bodyData = {
      timeStamp1: timeStamp1,
      timeStamp2: timeStamp2,
    };

    // Fetch robot utilization data from the fleet server
    let utilizationData = await getFleetTask("get_robotUtilization", bodyData);

    // Handle cases where the response does not contain the expected data
    if (!("robots" in utilizationData))
      return res.status(200).json({
        msg: "data sent, no utilization data available",
        robots: null,
      });

    // Format the robot utilization data
    let formattedUtilization = utilizationData.robots.map((robot) => {
      return {
        robot_id: robot.robot_id,
        robot_name: robot.robot_name,
        utilization_percentage: robot.utilization_percentage,
        last_active: robot.last_active, // Add any additional fields as needed
      };
    });

    return res.status(200).json({
      msg: "data sent",
      robots: formattedUtilization,
    });
  } catch (err) {
    console.log("error occurred : ", err);
    if (err.name === "CastError")
      return res.status(400).json({ msg: "not valid map Id" });
    res.status(500).json({ opt: "failed", error: err });
  }
};

const cancelTask = async (req, res) => {
  const { mapId, taskId } = req.body;
  try {
    // Check if the map exists in the database
    let isMapExists = await Map.exists({ _id: mapId });
    if (!isMapExists)
      return res.status(500).json({ msg: "map not exists", map: null });

    // Prepare body data for the API call
    let bodyData = {
      taskId: taskId,
    };

    // Fetch robot utilization data from the fleet server
    let cancel_Task = await taskOperation("cancelTask", bodyData);
    // console.log(taskId,cancel_Task);
    if (cancel_Task.errorCode === 4006 || cancel_Task.errorCode !== 1000)
      return res.status(200).json({
        msg: cancel_Task.messageText,
        response: cancel_Task.responseId,
        isTaskCancelled: false,
      });
    if (cancel_Task.errorCode === 1000)
      return res.status(200).json({
        msg: "Task Cancelled",
        isTaskCancelled: true,
      });
  } catch (err) {
    console.log("error occurred : ", err);
    if (err.name === "CastError")
      return res.status(400).json({ msg: "not valid map Id" });
    res.status(500).json({ isTaskCancelled: false, opt: "failed", error: err });
  }
};

// Export the function along with others
module.exports = {
  getFleetTask,
  getTasks,
  getCurrTasksActivities,
  getRobotUtilization,
  cancelTask,
};

// Needed one!
/* const mapData = await Map.findOneAndUpdate(
      { _id: mapId },
      {
        $push: {
          tasks: { $each: fleetTasks.tasks }, // can push multiple entries to the array using $each
        },
      }
      // { new: true } // which returns the updated document of the Map..
    ); 

    let fleet_tasks = tasks.tasks.map((task) => {
      return {
        task_id: task.task_id,
        agent_ID: task.agent_ID,
        agent_name: task.agent_name,
        task_status: task.task_status.status,
      };
    });
*/
