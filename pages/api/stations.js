import headers from '../../utils/auth'

export const handler = async (req, res) => {
  try {
    const response = await (
      await fetch(
        `${process.env.TRA_API_HOST}/Station?$top=30000&$format=JSON`,
        { headers },
      )).json()
    if (response.code) throw response
    const stations = response.map(station => ({
      id: station.StationID,
      name: {
        tw: station.StationName.Zh_tw,
        en: station.StationName.En,
      }
    }))
    res.status(200).json(stations)
  } catch (error) {
    res.status(500).json({ message: `Something wrong` })
  }
}

export default handler
