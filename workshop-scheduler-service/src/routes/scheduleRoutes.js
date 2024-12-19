const express = require("express");
const {
    getAllSchedules,
    getScheduleById,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    markAsNotified
} = require("../controllers/scheduleController");

const router = express.Router();

router.get("/", getAllSchedules);
router.get("/:id", getScheduleById);
router.post("/", createSchedule);
router.put("/:id", updateSchedule);
router.delete("/:id", deleteSchedule);
router.patch('/:id/notify', markAsNotified);


module.exports = router;
