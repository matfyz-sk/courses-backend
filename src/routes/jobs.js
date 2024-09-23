import express from "express"
import {scheduleBadge, cancelBadge} from "../services/jobs/index.js"

export const jobsRouter = express.Router()

jobsRouter.post("/schedule", scheduleBadge)
jobsRouter.post("/cancel", cancelBadge)