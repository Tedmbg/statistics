
import DoughnutC from "../../../components/DoughnutC";
import LineChart from "../../../components/LineChart";


// member data 


const memberData={
    labels:[
      'Jan',
      'Feb',
      'March',
      'Apr'
    ],
    datasets:[
      {
      data:[65,34,12,56,78],
      fill:false,
      radius:3,
      borderColor:'#5687F2'
      }
  ]
}

function Baptism() {
  return (
    <> 
    {/* <div style={{
   width:"20rem"
     }}> <DoughnutC data={workData}/></div> */}
     <div style={{
      width:"20rem"
     }}> <LineChart data={memberData}/></div>
     </>
  )
}

export default Baptism
