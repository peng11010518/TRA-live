import headers from '../../../../utils/auth'

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
    const live = await getLiveBoardServerSide(id)
    res.status(200).json(JSON.stringify(live))
  } catch (error) {
    res.status(500).json({ message: `Something wrong` })
  }
}

export const getLiveBoardServerSide = async (id) => {
  const response = await (
    await fetch(
      `${process.env.TRA_API_V2_HOST}/LiveBoard/Station/${id}?$top=30000&$format=JSON`,
      { headers },
    )).json()
  if (response.code) throw response
  const live = response.map(train => ({
    id: train.TrainNo,
    delayTime: train.DelayTime || 0,
  }))
  return live
}

export default handler
