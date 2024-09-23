import { runQuery } from "../../query/gqlQuery.js"
import schedule from "node-schedule"


const enableQuery = (instance, id, badgeId, users, awardableTo, additional, color) => {
    runQuery(`
        mutation {
            update_courses_CourseBadgeType (
              _id: "${id}"
              courses_enabled: true
            ){
              _id
            }
        }
    `)
            
    users.forEach(user => {
        runQuery(`
            mutation {
                insert_courses_AwardableBadge (
                    courses_courseInstance: "${instance}"
                    courses_courseBadgeType: "${id}"
                    courses_badgeType: "${badgeId}"
                    courses_hasUser: "${user}"
                    courses_awardableTo: "${awardableTo}"
                    courses_awardedTo: ""
                    courses_awardComment: ""
                    ${additional ? `courses_additional: "${additional}"` : ""}
                    courses_color: "${color}"
                ) {
                    _id
                }
            }
        `)
    })
}

const disableQuery = (id) => {
    runQuery(`
        mutation {
            update_courses_CourseBadgeType (
              _id: "${id}"
              courses_enabled: false
          ){
                _id
            }
        }
    `)

    runQuery(`
        mutation {
            delete_courses_AwardableBadge (
                courses_awardedTo: "",
                courses_courseBadgeType: "${id}"
            ) {
                _id
            }
        }
    `)
}

const run = (req, res) => {
    const {instance, id, badgeId, enableDate, disableDate, users, awardableTo, additional, color} = req.body
    const enDate = new Date(enableDate)
    const disDate = new Date(disableDate)
    const now = Date.now()

    if (enDate < disDate && disDate > now) {
        try {
            if (enDate <= now) {
                schedule.cancelJob(`${id}_enable`)
                schedule.cancelJob(`${id}_disable`)
                enableQuery(instance, id, badgeId, users, awardableTo, additional, color)
            }
            else {
                schedule.scheduleJob(`${id}_enable`, enableDate, () => {
                    schedule.cancelJob(`${id}_enable`)
                    schedule.cancelJob(`${id}_disable`)
                    enableQuery(instance, id, badgeId, users, awardableTo, additional, color)
                })
            }
        } catch (error) {
            console.error(error)
            res.status(500).json({ error: 'An error occurred' })
        }
        
        schedule.scheduleJob(`${id}_disable`, disableDate, () => {
            try {
                disableQuery(id)
            } catch (error) {
                console.error(error)
                res.status(500).json({ error: 'An error occurred' })
            }
        })
    }
}

export const scheduleBadge = run