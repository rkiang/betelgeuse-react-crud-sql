import React, { Component } from 'react';
import './App.css';
const url = 'http://localhost:5000/api';

class App extends Component {
  constructor() {
    super();
    this.state = {
      title: 'Countries are really great!',
      countries: [],
      country_name: '',
      continent_name: ''
    }

    this.updateCountryName = this.updateCountryName.bind(this);
    this.updateContinentName = this.updateContinentName.bind(this); //
    this.addCountry = this.addCountry.bind(this);
  }

  componentDidMount() { //like onReady to keep looping for changes
    console.log('component has mounted');
    this.getCountries();
  }

  getCountries() {
    fetch(`${url}/countries`) // ES6 used, can still used url + /countries
    .then(response => response.json()) // ES6 shorthand for .then(function(response) { return response.json()}
    .then(countriesResponseArray => {
      console.log(countriesResponseArray);
      
      this.setState({ // makes whatever property and merges them, not changing them
        countries: countriesResponseArray
      });
    })
    .catch(error => console.log(`Error with Fetch getCountries: ${error}`));
  }

  updateCountryName(event) {
    this.setState({country_name: event.target.value}); // value from the input
  }

  updateContinentName(event) {
    this.setState({continent_name: event.target.value});
  }

  addCountry(event) {
    event.preventDefault(); //stops it from jumping to another page.
    const country_data = {
      country_name: this.state.country_name,  // req.body
      continent_name: this.state.continent_name,
    }
    const request = new Request(`${url}/new-country`, {
      method: 'POST',
      headers: new Headers({'Content-Type': 'application/json'}),
      body: JSON.stringify(country_data)
    });
    fetch(request) 
    .then(response => {
      console.log(`post was successful: ${response}`);
      this.getCountries();
    })
    .catch(error => console.log(`Fetch failed on addCountry Post: ${error}`)
    )
  }

  removeCountry(id) {
    const request = new Request(`${url}/remove/${id}`, {
      method: 'DELETE'
    });
  
    fetch(request)
      .then(response => {
        this.getCountries();
      })
      .catch(error => console.log(`Error Remove Country Fetch : ${error}`));
  }

  render() {
    return (
      <div className="App">
        <h1>{this.state.title}</h1>
        <form>
          <input type="text" value={this.state.country_name} onChange={this.updateCountryName} placeholder="Country Name"></input>
          <input type="text" value={this.state.continent_name} onChange={this.updateContinentName} placeholder="Continent Name"></input>
          <button onClick={this.addCountry}>Add Country</button>
        </form>
        {this.state.country_name} | {this.state.continent_name}
        <ul>
          {this.state.countries.map(country => (
            <li key={country.id}>{country.country_name} | {country.continent_name} {/* Call as in the database */}
            <button onClick={event => this.removeCountry(country.id)}>Delete</button>
              </li>
          ))} {/* Like ng-repeat */}
        </ul>
      </div>
    );
  }
}

export default App;
