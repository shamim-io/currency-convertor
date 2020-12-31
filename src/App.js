import './App.css';
import CurrencyRow from './CurrencyRow'
import { useState, useEffect } from 'react'

function App() {

  const BASE_URL = "https://api.exchangeratesapi.io/latest"

  const[currencyOptions, setCurrencyOptions] = useState([])
  const[fromCurrency, setFromCurrency] = useState()
  const[toCurrency, setToCurrency] = useState([])
  const[amount, setAmount] = useState(1)
  const[amountInFromCurrency, setAmountInFromCurrency] = useState(true)
  const[excahngeRate, setExchangeRate] = useState()

  let toAmount, fromAmount
  if(amountInFromCurrency) {
    fromAmount = amount
    toAmount = amount * excahngeRate
  } else {
    toAmount = amount/excahngeRate
  }

  useEffect(() => { 
    fetch(BASE_URL)
    .then(res => res.json())
    .then (data => {

      const firstCurrency = Object.keys(data.rates)[0]
      setCurrencyOptions([data.base, ...Object.keys(data.rates)])
      setFromCurrency(data.base)
      setToCurrency(firstCurrency)
      setExchangeRate(data.rates[firstCurrency])
    })
  }, [])

  useEffect(() => {
    if (fromCurrency != null && toCurrency != null) {
      fetch(`${BASE_URL}?base=${fromCurrency}&symbols=${toCurrency}`)
      .then(res => res.json())
      .then(data => setExchangeRate(data.rates[toCurrency]))
    }
  }, [fromCurrency, toCurrency])

    

  function handleFromAmountChange(e) {
    setAmount(e.target.value)
    setAmountInFromCurrency(true)
  }

  function handleToAmountChange(e) {
    setAmount(e.target.value)
    setAmountInFromCurrency(false)
  }

  return (
    <div className="App">
      <h1>Currency Convertor</h1>
      <CurrencyRow 
        currencyOptions = {currencyOptions} 
        selectCurrency = {fromCurrency}
        onChangeCurrency = {e => {
          setFromCurrency(e.target.value)
        }}
        onChangeAmount = {handleFromAmountChange}
        amount = {fromAmount}
        />
        <div className="equals"> = </div>
      <CurrencyRow currencyOptions = {currencyOptions}  selectCurrency = {toCurrency}
          onChangeCurrency = {e => {
          setToCurrency(e.target.value)
        }}
          amount = {toAmount}
          onChangeAmount = {handleToAmountChange}
          />
    </div>
  );
}

export default App;
