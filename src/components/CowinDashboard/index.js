import {Component} from 'react'
import Loader from 'react-loader-spinner'
import VaccinationByAge from '../VaccinationByAge'
import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByGender from '../VaccinationByGender'
import './index.css'

// Write your code here
class CowinDashboard extends Component {
  state = {covidVaccinationData: {}}

  componentDidMount() {
    this.fetchcovidVaccinationData()
  }

  fetchcovidVaccinationData = async () => {
    const apiUrl = 'https://apis.ccbp.in/covid-vaccination-data'
    const response = await fetch(apiUrl)
    const data = await response.json()
    const updataData = {
      last7DaysVaccination: data.last_7_days_vaccination.map(eachItem => ({
        vaccineDate: eachItem.vaccine_date,
        dose1: eachItem.dose_1,
        dose2: eachItem.dose_2,
      })),
      vaccinationByAge: data.vaccination_by_age,
      vaccinationByGender: data.vaccination_by_gender,
    }
    this.setState({covidVaccinationData: updataData})
  }

  renderLoadingView = () => (
    <div className="loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  render() {
    const {covidVaccinationData} = this.state
    const {
      last7DaysVaccination,
      vaccinationByGender,
      vaccinationByAge,
    } = covidVaccinationData
    return (
      <div className="app-container">
        <div className="cowindashboard-container">
          <div className="logo-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
              alt="website logo"
              className="logo"
            />
            <p className="logo-text">Co-WIN</p>
          </div>
          <h1 className="heading">CoWIN Vaccination in India</h1>
          <VaccinationCoverage vaccinationDetails={last7DaysVaccination} />
          <VaccinationByGender vaccinationDetails={vaccinationByGender} />
          <VaccinationByAge vaccinationDetails={vaccinationByAge} />
        </div>
      </div>
    )
  }
}
export default CowinDashboard
