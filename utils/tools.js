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
