import React from 'react'
import VehicleSearchForm from './pages/VehicleSearchForm'
import BookVehicle from './pages/bookVehicle'
import Login from './pages/Login'
import VehicleProviderRegister from './pages/vehicleProviderRegister' 
import CarRentalSection from './pages/carRentalSection'


const App = () => {
  return (
    <div>
      <Login/>
      <vehicleProviderRegister/>
      <VehicleSearchForm/>
      <BookVehicle/>
      <CarRentalSection/>
    </div>

    
  )
}

export default App
