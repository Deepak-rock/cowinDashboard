import {Component} from 'react'
import Loader from 'react-loader-spinner'
import VaccinationByAge from '../VaccinationByAge'
import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByGender from '../VaccinationByGender'
import './index.css'

// Write your code here
const apiStatusContants = {
  initial: 'INITIAL',
  loading: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class CowinDashboard extends Component {
  state = {covidVaccinationData: {}, apiStatus: apiStatusContants.initial}

  componentDidMount() {
    this.fetchcovidVaccinationData()
  }

  fetchcovidVaccinationData = async () => {
    this.setState({apiStatus: apiStatusContants.loading})
    const apiUrl = 'https://apis.ccbp.in/covid-vaccination-data'
    const response = await fetch(apiUrl)
    if (response.ok) {
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
      this.setState({
        covidVaccinationData: updataData,
        apiStatus: apiStatusContants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusContants.failure})
    }
  }

  renderCowinPageView = () => {
    const {covidVaccinationData} = this.state
    const {last7DaysVaccination, vaccinationByGender, vaccinationByAge} =
      covidVaccinationData
    return (
      <>
        <VaccinationCoverage vaccinationDetails={last7DaysVaccination} />
        <VaccinationByGender vaccinationDetails={vaccinationByGender} />
        <VaccinationByAge vaccinationDetails={vaccinationByAge} />
      </>
    )
  }

  renderFailureview = () => (
    <div className="failureveiw-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        className="failure-img"
        alt="failure view"
      />
      <h2 className="failure-description">Something went wrong</h2>
    </div>
  )

  renderCowinDashboard = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusContants.success:
        return this.renderCowinPageView()
      case apiStatusContants.loading:
        return this.renderLoadingView()
      case apiStatusContants.failure:
        return this.renderFailureview()
      default:
        return null
    }
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  render() {
    return (
      <div className="app-container">
        <div className="responsive-container">
          <div className="logo-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
              alt="website logo"
              className="logo"
            />
            <p className="logo-text">Co-WIN</p>
          </div>
          <h1 className="heading">CoWIN Vaccination in India</h1>
          {this.renderCowinDashboard()}
        </div>
      </div>
    )
  }
}
export default CowinDashboard
