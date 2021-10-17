const express = require("express");
const app = express();
const port = process.env.PORT 
require("./db/mongoose");
const userRouter = require("./routers/users");
const tasksRouter = require("./routers/tasks");

app.use(express.json());

app.use(userRouter);

app.use(tasksRouter);


 

app.listen(port, () => {
  console.log("express servewr in use")
});

// const Tasks = require("./models/tasks");
// const Users = require("./models/users");

// const fn = async function () {
//   const task = await Tasks.findById("6168c61d6dd0f0d1265b1a3b");

//   await task.populate("userId")

//   const user = await Users.findById("6168cb6da59abcb9491300c1")
//   await user.populate("tasks")
//   console.log(user.tasks, 'ikinci');
//  };

// fn();
