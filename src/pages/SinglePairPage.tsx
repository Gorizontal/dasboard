/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState} from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { observer } from "mobx-react-lite"
import { store } from "../Store/store"
import { toJS } from "mobx"
import { TokenForm } from "../components/tokenForm/TokenForm"
import { Transactions } from "../components/transactions/Transactions"
import { PairInformation } from "../components/PairInformation/PairInformation"
import FavouritesButton from "../components/favouritesButton/FavouritesButton"
import { SearchInput } from "../components/searchInput/SearchInput"
import { ChartsForm } from "../components/charts/ChartsPrice"
import { ChartsOverview } from "../components/charts/ChartsOverview"
import {ButtonsCharts} from "../components/buttonsGroupe/ButtonsCharts"
import Spinner from "../components/spinner/Spinner"

interface Props {
    
}

const SinglePairPageComponent = (props: Props) => {
    const [typeButtonCharts, setTypeButtonCharts] = useState('Liquidity')
    const [errorTransaction, setErrorTransaction] = useState(false)
    const {getSinglePair, getPairSingleApi, getErrorSinglePair}  = store
    const {address} = useParams()    
    const navigate = useNavigate()
    const goBack = ()=> navigate(-1)


    const HandleChartsComponent = () => {
        if(toJS(getSinglePair.liquidity_graph)){
            if(typeButtonCharts === "Liquidity"){ 
                return ( <ChartsOverview titleMarker={false} type={'Liquidity'} data ={toJS(getSinglePair.liquidity_graph)}/> ) }
            if(typeButtonCharts === "Volume"){         
                return ( <ChartsOverview  titleMarker={false} type={'Volume (24hrs)'} data ={toJS(getSinglePair.volume_graph)}/> ) }
            if(typeButtonCharts === `${getSinglePair.token_one.symbol}-${getSinglePair.token_two.symbol}`){ 
                return ( <ChartsForm data ={toJS(getSinglePair.symbol_one_price_graph)}/> ) }
            if(typeButtonCharts === `${getSinglePair.token_two.symbol}-${getSinglePair.token_one.symbol}`){ 
                return ( <ChartsForm data ={toJS(getSinglePair.symbol_two_price_graph)}/> ) }
        }
        return <Spinner/>
    }

    useEffect(()=>{
        if(getErrorSinglePair) {setErrorTransaction(true)}
        if(!getErrorSinglePair) { setErrorTransaction(false)}
        getPairSingleApi(address, '1Y')
        
    }, [address])

    
  
    
    return ( 
        <>
            {getSinglePair.symbol_one_indicators ? 
                            ( getErrorSinglePair ? "?????????????????? ????????????, ???? ???? ?????? ???????????? ?????? ????????????????" :  (
                                    <div className="flex w-full h-full flex-col">
                                        <div className="flex justify-between w-full  flex-wrap  items-center my-5">
                                                <div className="flex">
                                                    <button onClick={goBack}>
                                                        <span>&lArr;</span> 
                                                        <span className="ml-2 font-medium">Back</span>
                                                    </button>
                                                    <span className="ml-6">{getSinglePair.token_one.symbol}-{getSinglePair.token_two.symbol}</span>

                                                </div>
                                                <div className="w-1/2">
                                                    <SearchInput />
                                                </div>
                                        </div>

                                            <div className="flex justify-between items-end mt-10">
                                                <div className="flex items-end ">
                                                <div className="flex text-3xl font-medium">
                                                        <div className="z-10"><img src={getSinglePair.token_one.icon} alt="iconToken" width={36} height={36}/></div>
                                                        <div className="-ml-4"><img src={getSinglePair.token_two.icon} alt="iconToken" width={36} height={36}/></div>
                                                        <div className="ml-4">
                                                            {getSinglePair.token_one.symbol}-{getSinglePair.token_two.symbol} <span>Pair</span> 
                                                        </div>
                                                    </div>
                                            
                                                </div>
                                                <div>
                                                    <FavouritesButton symbol={`${getSinglePair.token_one.symbol}@-${getSinglePair.token_two.symbol}`}
                                                                    address={getSinglePair.address}  />

                                                                    {/* ?? ?????????????? @ ?????????? ???????????????? ?????????? ??????, ???????? ?????? ???????? ?????????? */}
                                                </div>
                                            </div>

                                            <div className="flex mt-8">
                                                <div className="items-center bg-cyan-700 bg-opacity-40 rounded-lg px-3 py-1 hover:bg-opacity-70 mr-2">
                                                    <Link to={`https://tonapi.io/account/${getSinglePair.token_one.address}` }
                                                        target="_blank"> 
                                                        <button > 
                                                            {`1 ${getSinglePair.token_one.symbol} =< ${getSinglePair.symbol_one_indicators.current_pair_price.value} ${getSinglePair.token_two.symbol} (${getSinglePair.symbol_two_indicators?.current_usd_price?.value} $)`}
                                                        </button>
                                                    </Link>    
                                                </div>
                                                <div className="items-center bg-cyan-700 bg-opacity-40 rounded-lg px-3 py-1 hover:bg-opacity-70 mr-2">
                                                    <Link to={`https://tonapi.io/account/${getSinglePair.token_two.address}` }
                                                        target="_blank"> 
                                                        <button> 
                                                            {`1 ${getSinglePair.token_two.symbol} =< ${getSinglePair?.symbol_two_indicators?.current_pair_price?.value} ${getSinglePair.token_one.symbol} (${getSinglePair.symbol_two_indicators?.current_usd_price?.value} $)`}
                                                        </button>
                                                    </Link>    
                                                </div>
                                            </div>

                                                    {/* ???????????????????? ???? ???????? */}

                                            <div className="flex flex-col mt-10">
                                                <div className="text-xl">Pair Stats</div>
                                                <div className="flex justify-between mt-3">
                                                    {/* ?????????? ??????????*/}

                                                    <div className="flex flex-col w-4/12 mr-2">
                                                        <TokenForm title={'Liquidity'} value={getSinglePair.liquidity.value} change={getSinglePair.liquidity.change}/>
                                                        <TokenForm title={'Volume (24hrs)'} value={getSinglePair.volume_24h.value} change={getSinglePair.volume_24h.change}/>
                                                        <TokenForm title={'Fees (24hrs)'} value={getSinglePair.fees_24h.value} change={getSinglePair.fees_24h.change}/>
                                                        <div className="flex flex-col bg-cyan-700 bg-opacity-40 rounded-2xl p-4 mb-2">
                                                            <div className='mb-3'>
                                                                <h3>Pooled Tokens</h3>
                                                            </div>
                                                            <div className="flex">
                                                                <div className="mb-3">
                                                                    <img src={getSinglePair.token_one.icon} alt="iconToken" width={24} height={24}/> 
                                                                </div>
                                                                <div className="ml-2"> <span>{getSinglePair.symbol_one_indicators.pool_quantity.value}</span> {getSinglePair.token_one.symbol}</div>
                                                            </div>
                                                            <div className="flex">
                                                                <div className="mb-3">
                                                                    <img src={getSinglePair.token_two.icon} alt="iconToken" width={24} height={24}/> 
                                                                </div>
                                                                <div className="ml-2"> <span>{getSinglePair.symbol_two_indicators.pool_quantity.value}</span> {getSinglePair.token_two.symbol}</div>
                                                            </div> 
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col w-8/12 bg-green-200 bg-opacity-20 rounded-2xl mb-2 ">
                                                        <div className="h-1/12 w-1/3 flex bg-transparent p-2 justify-between">
                                                            <ButtonsCharts namePairsOne={getSinglePair.token_one.symbol} 
                                                                            namePairsTwo={getSinglePair.token_two.symbol} 
                                                                            isPairs={true} 
                                                                            typeButtonCharts={typeButtonCharts} 
                                                                            setTypeButtonCharts={setTypeButtonCharts}/>
                                                        </div>
                                                        <div className="h-full">
                                                            <HandleChartsComponent/>
                                                        </div>                    
                                                    </div>
                                                </div>
                                            </div>

                                                {/* ???????????????????? */}

                                            <div className="flex flex-col mt-5">
                                                <h2 className="text-2xl font-normal">Transaction</h2>   
                                                <Transactions data={getSinglePair.transactions} error={errorTransaction}/>
                                            </div>  

                                                {/* Pair Information */}

                                            <div className="flex flex-col mt-5">
                                                <h2 className="text-2xl font-normal">Pair Information</h2>
                                                <PairInformation pairname={`${getSinglePair.token_one.symbol} - ${getSinglePair.token_two.symbol}`}
                                                                    pairAddress={getSinglePair.address}
                                                                    DAIaddress='1223123'
                                                                    USDCAddress="123123"/>    
                                            </div>  

                                            <div className="flex w-full h-10 m-10">
                                                    
                                            </div>

                                    </div>
                                )
                            ) : ( getErrorSinglePair ? "?????????????????? ????????????, ???? ???? ?????? ???????????? ?????? ????????????????" : <Spinner/>)
            }
        </>

    )
}

export const  SinglePairPage = observer(SinglePairPageComponent)
