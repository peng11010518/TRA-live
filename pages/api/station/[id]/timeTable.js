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

export const getTimetableBoardServerSide = async (id) => {
  const today = dayjs().format('YYYY-MM-DD')
  const response = await (
    await fetch(
      `${process.env.TRA_API_V2_HOST}/DailyTimetable/Station/${id}/${today}?$format=json`,
      { headers },
    )).json()
  if (response.code) throw response
  const timetable = response.map(train => ({
    id: train.TrainNo,
    direction: train.Direction,
    trainType: trainTypeList[train.TrainTypeCode] || '',
    endingStationName: {
      tw: train.EndingStationName.Zh_tw,
      en: train.EndingStationName.En,
    },
    scheduledDepartureTime: train.DepartureTime,
  }))
  return timetable
}

export default handler
