const express = require("express");
const router = express.Router();

router.get("/quiz", (req, res) => {
    res.status(200).send("Quiz is running successfully!");

});

module.exports = router;
