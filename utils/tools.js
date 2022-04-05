import dayjs from 'dayjs'

const utc = require('dayjs/plugin/utc')
dayjs.extend(utc)

export const gmtString = dayjs().utc().format('ddd, DD MMM YYYY HH:mm:ss [GMT]')

export const mergeLiveToTimeTable = ({ live, timeTable }) => (
  timeTable.map(timeTableTrain => {
    const liveTrain = live.find(live => live.id === timeTableTrain.id)
    if (liveTrain) return ({ ...timeTableTrain, ...liveTrain })
    return timeTableTrain
  })
)
