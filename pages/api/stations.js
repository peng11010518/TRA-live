import headers from '../../utils/auth'

export const handler = async (req, res) => {
  try {
    const response = await (
      await fetch(
        `${process.env.TRA_API_HOST}/Station?$top=30000&$format=JSON`,
        { headers },
      )).json()
    if (response.code) throw response
    res.status(200).json(response)
  } catch (error) {
    res.status(500).json({ message: `Something wrong` })
  }
}

export default handler
