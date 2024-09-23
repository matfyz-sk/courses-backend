import schedule from "node-schedule"

const run = (req, res) => {
    const {id} = req.body
    schedule.cancelJob(`${id}_enable`)
    schedule.cancelJob(`${id}_disable`)
}

export const cancelBadge = run