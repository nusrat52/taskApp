const express = require("express");
const tasks = require("../models/tasks");
const router = express.Router();
const auth = require("../models/auth");

const { Error } = require("mongoose");

router.post("/tasks", auth, async (req, res) => {
  
  try {
    const task = new tasks({ ...req.body, userId: req.user._id });
    const response = await task.save();
    res.send(response);
  } catch (e) {
    res.status(403).send(e);
  }
});

router.get("/tasks", auth, async (req, res) => {
  const match = {};
  const sort = {};
  if (req.query.sortBy) {
    let st = req.query.sortBy.split("_");
    sort[st[0]] = parseInt(st[1]);
  }
   if (req.query.completed) {
    match.completed = req.query.completed === "true";
  }
  try {
    const response = req.user;
    const resF = await response.populate({
      path: "tasks",
      match,
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort
      },
    });
    res.send(resF.tasks);
  } catch (e) {
    res.status(404).send();
  }
});

router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const response = await tasks.findOne({ _id, userId: req.user._id });

    if (!response) {
      return res.send({ error: "hemen id de esya bulunamadi" });
    }
    res.send(response);
  } catch (e) {
     res.status(500).send(e);
  }
});

router.patch("/tasks/:id", auth, async (req, res) => {
  const { body } = req;
  const bodyKeys = Object.keys(body);
  const { id } = req.params;

  isAllowed = ["description", "completed"];
  const isValidUpdate = Object.keys(body).every((ke) => {
    return isAllowed.includes(ke);
  });

  if (!isValidUpdate) {
    return res.status(404).send({ error: "Hemen key not allowed" });
  }

  try {
    const response = await tasks.findOne({ _id: id, userId: req.user._id });
    if (!response) {
      throw new Error("new error");
    }

    bodyKeys.forEach((ke) => {
      response[ke] = body[ke];
    });

    await response.save();
    res.send(response);
  } catch (e) {
    console.log(e);
    res.status(404).send(e);
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  const { id } = req.params;
  try {
    const response = await tasks.findOne({ _id: id, userId: req.user._id });

    if (!response) {
      return res.send({ error: "yoxdu o id" });
    }
    const resDeleted = await response.remove();
    res.send(resDeleted);
  } catch (e) {
    res.status(404).send(e);
  }
});

module.exports = router;
