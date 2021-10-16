import headers from '../../../../utils/auth'

const trainTypeList = {
  '1': '太魯閣',
  '2': '普悠瑪',
  '3': ' 自強 ',
  '4': ' 莒光 ',
  '5': ' 復興 ',
  '6': ' 區間 ',
  '7': ' 普快 ',
  '10': '區間快',
}

export const handler = (req, res) => {
  const { id } = req.query
  try {
    const live = getLiveBoardServerSide(id)
    res.status(200).json(JSON.stringify(live))
  } catch (error) {
    res.status(500).json({ message: `Something wrong` })
  }
}

export const getLiveBoardServerSide = async (id) => {
  const response = await (
    await fetch(
      `${process.env.TRA_API_HOST}/LiveBoard/Station/${id}?$top=30000&$format=JSON`,
      { headers },
    )).json()
  if (response.code) throw response
  const live = response.map(train => ({
    id: train.TrainNo,
    direction: train.Direction,
    trainType: trainTypeList[train.TrainTypeCode],
    endingStationName: {
      tw: train.EndingStationName.Zh_tw,
      en: train.EndingStationName.En,
    },
    scheduledDepartureTime: train.ScheduledDepartureTime.slice(0, -3),
    delayTime: train.DelayTime,
  }))
  return live
}

export default handler
