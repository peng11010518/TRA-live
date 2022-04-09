import dayjs from 'dayjs'

const utc = require('dayjs/plugin/utc')
dayjs.extend(utc)

const today = dayjs().format('YYYY/MM/DD')

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
  return (
    timeBoard.map(timeTableTrain => {
      const liveTrain = liveBoard.find(live => live.id === timeTableTrain.id)
      const isNotPass = dayjs().locale('zh-tw').isBefore(`${today} ${timeTableTrain.scheduledDepartureTime}`, 'minute')
      if (liveTrain) {
        islive = true
        return ({ ...timeTableTrain, ...liveTrain })
      }
      if (islive || isNotPass) return timeTableTrain
    }).filter(item => item)
  )
}
