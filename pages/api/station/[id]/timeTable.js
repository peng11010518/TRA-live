import headers from '../../../../utils/auth'
import dayjs from 'dayjs'

// TODO: Get Code from API
const trainTypeList = {
  '1': '太魯閣',
  '2': '普悠瑪',
  '3': ' 自強 ',
  '4': ' 莒光 ',
  '5': ' 復興 ',
  '6': ' 區間 ',
  '7': ' 普快 ',
  '10': '區間快',
  '11': ' 自強 ',
}

export const handler = async (req, res) => {
  const { id } = req.query
  try {
    const timetable = await getTimetableBoardServerSide(id)
    res.status(200).json(JSON.stringify(timetable))
  } catch (error) {
    res.status(500).json({ message: `Something wrong` })
  }
}

const getTransfered = res => res.map(train => ({
  id: train.TrainNo,
  trainType: trainTypeList[train.TrainTypeCode] || '',
  endingStationName: train.DestinationStationName.Zh_tw,
  scheduledDepartureTime: train.DepartureTime,
}))

export const getTimetableBoardServerSide = async (id) => {
  const response = await (
    await fetch(
      `${process.env.TRA_API_V3_HOST}/DailyStationTimetable/Today/Station/${id}?$format=json`,
      { headers },
    )).json()
  const [right, left] = response.StationTimetables
  return ({
    directionRight: getTransfered(right.TimeTables),
    directionLeft: getTransfered(left.TimeTables),
  })
}

export default handler
