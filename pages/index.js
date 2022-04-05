import React, { useState } from 'react'
import Image from 'next/image'
import { getStationsServerSide } from './api/stations'
import { getLiveBoardServerSide } from './api/station/[id]/liveBoard'
import { getTimetableBoardServerSide } from './api/station/[id]/timeTable'
import { getLiveBoard, getTimetableBoard } from '../utils/apis'
import { mergeLiveToTimeTable } from '../utils/tools'

const STATION_TAIPEI_ID = '1000'

const TrainCard = ({ train }) => {
  const endingStationName = train.endingStationName.tw
  return (
    <div className="flex flex-row p-4 my-2 bg-white rounded-xl shadow-sm items-center justify-between h-24">
      <div className="flex-1 flex-col max-w-[40%]">
        <div className="text-xl font-medium text-black">{train.scheduledDepartureTime}</div>
        {endingStationName.includes('-') || endingStationName.length > 3
          ? endingStationName.split('-').map((name, index) =>
            <p className="text-gray-500 text-xs" key={`${name}-${index}`}>{name}</p>)
          : <p className="text-gray-500">{endingStationName}</p>}
      </div>
      <div className="flex-shrink-0 flex-col min-w-[50%] sm:min-w-[30%] text-center">
        <p className="text-gray-300 text-xl">{train.trainType}</p>
        {(() => {
          switch (train.delayTime) {
            case undefined:
              return
            case 0:
              return <div className="text-sm py-1 px-3 mt-2 bg-emerald-400 rounded-xl text-white">on Time</div>
            default:
              return <div className="text-sm py-1 px-3 mt-2 bg-rose-500 rounded-xl text-white">{train.delayTime} min</div>
          }
        })()}
      </div>
    </div>
  )
}

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

const Home = ({ stations, defaultBoard }) => {
  const [liveBoard, setLiveBoard] = useState(defaultBoard)

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
              const timeTable = await getTimetableBoard(value)
              const live = await getLiveBoard(value)
              const table = mergeLiveToTimeTable({ live, timeTable })
              setLiveBoard(table)
            }}
          >
            {stations.map(station => (
              <option value={station.id} key={station.id}>{station.name.tw}</option>
            ))}
          </select>
        </div>
        <LiveBoard datas={liveBoard} />
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
  const live = await getLiveBoardServerSide(STATION_TAIPEI_ID)
  const timeTable = await getTimetableBoardServerSide(STATION_TAIPEI_ID)
  const defaultBoard = mergeLiveToTimeTable({ live, timeTable })
  return {
    props: {
      stations,
      defaultBoard,
    },
  }
}

export default Home