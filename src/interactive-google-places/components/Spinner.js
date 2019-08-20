import React, {useContext} from 'react'
import LoadingContext from '../contexts/loading.context'
const loader = require('../../jdeLoading.gif')

const Spinner = (props) => {
    const { loadingCount } = useContext(LoadingContext)

     return(
         <>
         {loadingCount > 0 &&
        <div className={"loading-overlay"}>
            <img className={"loading-icon"} src={loader} alt="Loading"/>
         </div> 
        }
        </>
     );
 }
 
 export default Spinner;