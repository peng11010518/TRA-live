import React, { useState } from 'react'
import Image from 'next/image'
import { getStationsServerSide } from './api/stations'
import { getLiveBoardServerSide } from './api/station/[id]/liveBoard'
import { getLiveBoard } from '../utils/apis'

const STATION_TAIPEI_ID = '1000'

const TrainCard = ({ train }) => (
  <div className="p-4 max-w-xs mx-auto bg-white rounded-xl shadow-sm flex items-center space-x-4 my-2 flex flex-row">
    <div className="flex-1 flex-col">
      <div className="text-xl font-medium text-black">{train.scheduledDepartureTime}</div>
      <p className="text-gray-500">{train.endingStationName.tw}</p>
    </div>
    <div className="flex-shrink-0 flex-col min-w-[30%] text-center">
      <p className="text-gray-300 text-xl">{train.trainType}</p>
      {train.delayTime
        ? <div className="text-sm py-1 px-3 mt-2 bg-rose-500 rounded-xl text-white">{train.delayTime} min</div>
        : <div className="text-sm py-1 px-3 mt-2 bg-emerald-400 rounded-xl text-white">on Time</div>
      }
    </div>
  </div>
)

const LiveBoard = ({ datas }) => (
  <div className="flex flex-row p-3 space-x-4">
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
  console.log(liveBorad)

  return (
    <div className="container mx-auto sm:px-2 md:px-4 py-2 lg:px-8 py-4 w-screen">
      <div className="flex flex-col">
        <div className="flex flex-row justify-between p-3">
          <Image className="basis-1/4" alt="logo" height="58px" width="116px" src="/logo.jpg" />
          <div className="basis-2/4"></div>
          <select
            className="basis-1/4 block py-4 rounded-xl border-gray-300 shadow-sm focus:border-sky-300 focus:ring focus:ring-sky-200 focus:ring-opacity-50"
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
        <div className="flex-row py-3 text-center">
          <p className="text-slate-700">
            {'資料來源 '}
            <a className="underline decoration-sky-500" href="https://ptx.transportdata.tw/" target="_blank">
              交通部PTX服務平臺
            </a>
          </p>

          <Image height="16px" width="28px" src="https://ptx.transportdata.tw/PTX/logo.jpg" />
        </div>
      </div>
    </div>
  )
}

export async function getStaticProps() {
  const stations = await getStationsServerSide()
  const defaultLive = await getLiveBoardServerSide(STATION_TAIPEI_ID)
  return {
    props: {
      stations,
      defaultLive,
    },
  }
}

export default Home