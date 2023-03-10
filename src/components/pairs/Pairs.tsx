import { store } from "../../Store/store"
import { observer } from "mobx-react-lite"
import { useEffect, useState } from "react"
import {toJS} from "mobx"
import { Link } from "react-router-dom"
import uniqid from 'uniqid'
import FavouritesButton from "../favouritesButton/FavouritesButton"
import { Pagination } from "../pagination/Pagination";
import {ButtonTokens} from "../buttonsGroupe/ButtonGroupeForm"
import { numberWithSpaces } from "../../function/numberWithSpaces"
import { numberColor } from "../../function/colorChanges"
import Spinner from "../spinner/Spinner"

interface Props {
    data: any
}

const PairsComponent = ( {data}: Props) => {
    const [currentPage, setCurrentPage] = useState(1)
    const [itemPerPage, setItemPerPage] = useState(8)
    const {getPairs, buttonPairs, activeButtonPairs, pairsApi, getErrorPairs} = store

    useEffect(()=>{
        pairsApi()
    },[])
   
    

    const lastItemIndex = currentPage * itemPerPage;
    let firstItemIndex = lastItemIndex - itemPerPage;
    let idx = firstItemIndex+1

   const pairs =data?.slice(firstItemIndex, lastItemIndex).map((pair: any, index:number)=>{
    
    return (
        <div key={uniqid()} className="flex w-full justify-between p-4 border-b border-gray-50 border-opacity-20">
                <div className="w-1/3">
                    <div className="flex items-center ">
                        <span className="mr-3"> {idx++}</span>
                        <img className="-mr-2 z-10" src={pair.token_one.icon} alt="imgToken1" style={{width: 20, height: 20}}/>
                        <img className="mr-3" src={pair.token_two.icon} alt="imgToken2" style={{width: 20, height: 20}}/>
                        <Link to={`/pairs/${pair.address}`}>   <span className=" font-medium text-slate-900 text-opacity-80 hover:text-slate-50 "> <span>{pair.name}</span></span>  </Link>
                    </div>
                </div>
                <div className="flex w-2/3 ">
                    {
                       pair.liquidity?.value && (
                        <>
                            <div className="flex w-1/5 "><span>{numberWithSpaces(pair.liquidity.value)} $</span></div>
                            <div className="flex w-1/5"><span>{pair.volume_24h.value} $</span></div>
                            <div className="flex w-1/5"><span>{pair.volume_7d.value} $</span></div>
                            <div className="flex w-1/5"><span className="flex">{pair.fees_24h.value} $</span></div>
                            <div className={`${numberColor(pair.volume_24h.change)} flex  whitespace-nowrap w-1/5 font-bold`}><span>{pair.volume_24h.change} %</span></div>

                        </>
                       )
                    }
                </div>
        </div>
    )
   })

    return (
       
                <div className="w-full border rounded-2xl mt-4">
                    <div className="flex  w-full  p-4 border-b border-gray-50 border-opacity-60">
                        <div  className="w-1/3"> 
                            <div>Name</div>
                        </div>

                        <div className="flex w-2/3 ">
                        <ButtonTokens arrButtons={buttonPairs} data={getPairs} key={uniqid()}  active = {activeButtonPairs} type='pairs'/>
                        </div>
                    </div>

                    {data.length ? (
                                <>
                                    {!getErrorPairs ? pairs : '?????????????????? ????????????, ???? ???? ???????????? ?????? ????????????????'}
                                </>
                                ) : ( getErrorPairs ? '?????????????????? ????????????, ???? ???? ???????????? ?????? ????????????????' : ( 
                                                <div className='w-full h-full flex justify-center  items-center'>
                                                    <Spinner/>
                                                </div>) ) }
                   
                    <div className="flex justify-center items-center">
                        <Pagination totalItem={data?.length} 
                                    itemPerPage={itemPerPage}
                                    setCurrentPage={setCurrentPage}
                                    currentPage={currentPage}/>
                    </div>
                </div>
            )
        }




export const Pairs = observer(PairsComponent)