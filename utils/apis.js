const server = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : `https://tra-live.vercel.app`

export const getTimetableBoard = async (stationId) => {
  const res = await fetch(`${server}/api/station/${stationId}/timeTable`)
  const data = await res.json()
  return data
}

export const getLiveBoard = async (stationId) => {
  const res = await fetch(`${server}/api/station/${stationId}/liveBoard`)
  const data = await res.json()
  return data
}

export const getStations = async () => {
  const res = await fetch(`${server}/api/stations`)
  const data = await res.json()
  return data
}

export default server