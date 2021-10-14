import React, { useState } from 'react'
import Image from 'next/image'
import { getLiveBoard, getStations } from '../utils/apis'

const STATION_TAIPEI_ID = '1000'

const TrainCard = ({ train }) => (
  <div className="p-6 w-72 mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4 my-2 flex flex-row">
    <div className="flex-1 flex-col">
      <div className="text-xl font-medium text-black">{train.scheduledDepartureTime}</div>
      <p className="text-gray-500">{train.endingStationName.tw}</p>
    </div>
    <div className="flex-shrink-0 flex-col text-center">
      <div>
        <p className="text-gray-300 text-xl w-16">{train.trainType}</p>
      </div>
      {train.delayTime
        ? <div className="text-sm w-18 py-1 px-3 bg-red-600 rounded-xl text-white">{train.delayTime} min</div>
        : <div className="text-sm w-18 py-1 px-3 bg-green-400 rounded-xl text-white">準點</div>
      }
    </div>
  </div>
)

const LiveBoard = ({ datas }) => (
  <div className="flex flex-row py-3 space-x-4">
    <div className="flex-1">
      {datas
        .filter(train => train.direction === 0)
        .map(train => <TrainCard train={train} key={train.id} />)
      }
    </div>
    <div className="flex-1">
      {datas
        .filter(train => train.direction === 1)
        .map(train => <TrainCard train={train} key={train.id} />)
      }
    </div>
  </div>
)

const Home = ({ stations, defaultLive }) => {
  const [liveBorad, setLiveBoard] = useState(defaultLive)

  return (
    <div className="container mx-auto sm:px-2 md:px-4 py-2 lg:px-8 py-4 w-screen">
      <div className="flex flex-col">
        <div className="flex flex-row py-3">
          <select
            className="py-4 px-20 max-w mx-auto bg-white rounded-xl shadow-md flex items-center text-center"
            defaultValue={STATION_TAIPEI_ID}
            onChange={async (e) => {
              const value = e.target.value
              setLiveBoard(await getLiveBoard(value))
            }}
          >
            {stations.map(station => (
              <option value={station.id} key={station.id}>{station.name.tw}</option>
            ))}
          </select>
        </div>
        <LiveBoard datas={liveBorad} />
        <div className="flex-shrink-0 flex-row py-3 text-center">
          資料來源 交通部PTX服務平臺
          <a href="https://ptx.transportdata.tw/" target="_blank">
            <Image height="16px" width="28px" src="https://ptx.transportdata.tw/PTX/logo.jpg" />
          </a>
        </div>
      </div>
    </div>
  )
}

export async function getStaticProps() {
  const stations = await getStations()
  const defaultLive = await getLiveBoard(STATION_TAIPEI_ID)
  return {
    props: {
      stations,
      defaultLive,
    },
  }
}

export default Home