import dayjs from 'dayjs'

const utc = require('dayjs/plugin/utc')
dayjs.extend(utc)

export const gmtString = dayjs().utc().format('ddd, DD MMM YYYY HH:mm:ss [GMT]')

export const mergeLiveToTimeTable = ({ liveBoard, timeBoard }) => (
  timeBoard.map(timeTableTrain => {
    const liveTrain = liveBoard.find(live => live.id === timeTableTrain.id)
    if (liveTrain) return ({ ...timeTableTrain, ...liveTrain })
    return timeTableTrain
  })
)

export const getTableAfterLive = ({ liveBoard, timeBoard }) => {
  let islive = false
  let direction = 0
  return (
    timeBoard.map(timeTableTrain => {
      if (direction !== timeTableTrain.direction) {
        direction = timeTableTrain.direction
        islive = false
      }
      const liveTrain = liveBoard.find(live => live.id === timeTableTrain.id)
      if (liveTrain) {
        islive = true
        return ({ ...timeTableTrain, ...liveTrain })
      }
      if (islive) return timeTableTrain
    }).filter(item => item)
  )
}
