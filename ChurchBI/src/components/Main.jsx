
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromChildren,
} from "react-router-dom";

// Layourt
import RootLayout from "../Layouts/RootLayout";


// pages
import Dashboard from "../pages/dashboard/Dashboard";
import RetentionRate from "../pages/membership-management/retantionRate/RetentionRate";
import Demographics from "../pages/membership-management/demographics/Demographics";
import AddMember from "../pages/membership-management/addmember/AddMember";
import Discipleship from "../pages/membership-management/discipleship/Discipleship";
import Attendance from "../pages/membership-management/attendence/Attendance";
import ServiceMinistry from "../pages/ministries/service-ministry/ServiceMinistry"
import CreateMinistry from "../pages/ministries/create-ministry/CreateMinistry";
import FellowshipMinistry from "../pages/ministries/fellowship-ministry/FellowshipMinistry"
import Baptism from "../pages/membership-management/baptism/Baptism";

const router = createBrowserRouter(
    createRoutesFromChildren(
        <Route path="/" element={<RootLayout/>}>
            <Route index element={<Dashboard/>}/>
            <Route path="retantionRate" element={<RetentionRate/>}/> 
            <Route path="demographics" element={<Demographics/>}/>
            <Route path="addMember" element={<AddMember/>}/>
            <Route path="discipleship" element={<Discipleship/>}/>
            <Route path="attendance" element={<Attendance/>}/>
            <Route path="fellowshipMinistry" element={<FellowshipMinistry/>}/>
            <Route path="serviceMinistry" element={<ServiceMinistry/>}/>
            <Route path="createMinistry" element={<CreateMinistry/>}/>
            <Route path="baptism" element={<Baptism/>} />

           
        </Route>
    )
)

export default function Main(){
    return (
      <RouterProvider router={router}/>
    )
}

