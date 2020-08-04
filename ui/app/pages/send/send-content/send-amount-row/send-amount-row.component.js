import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { debounce } from 'lodash'
import SendRowWrapper from '../send-row-wrapper'
import AmountMaxButton from './amount-max-button'
import UserPreferencedCurrencyInput from '../../../../components/app/user-preferenced-currency-input'
import UserPreferencedTokenInput from '../../../../components/app/user-preferenced-token-input'

export default class SendAmountRow extends Component {

  static propTypes = {
    amount: PropTypes.string,
    amountConversionRate: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    balance: PropTypes.string,
    conversionRate: PropTypes.number,
    gasTotal: PropTypes.string,
    inError: PropTypes.bool,
    primaryCurrency: PropTypes.string,
    selectedToken: PropTypes.object,
    setMaxModeTo: PropTypes.func,
    tokenBalance: PropTypes.string,
    updateGasFeeError: PropTypes.func,
    updateSendAmount: PropTypes.func,
    updateSendAmountError: PropTypes.func,
    updateGas: PropTypes.func,
    maxModeOn: PropTypes.bool,
    isDerivedAddress: PropTypes.bool,
  }

  static contextTypes = {
    t: PropTypes.func,
  }

  componentDidUpdate (prevProps) {
    const { maxModeOn: prevMaxModeOn, gasTotal: prevGasTotal } = prevProps
    const { maxModeOn, amount, gasTotal, selectedToken } = this.props

    if (maxModeOn && selectedToken && !prevMaxModeOn) {
      this.updateGas(amount)
    }

    if (prevGasTotal !== gasTotal) {
      this.validateAmount(amount)
    }
  }

  updateGas = debounce(this.updateGas.bind(this), 500)

  validateAmount (amount) {
    const {
      amountConversionRate,
      balance,
      conversionRate,
      gasTotal,
      primaryCurrency,
      selectedToken,
      tokenBalance,
      updateGasFeeError,
      updateSendAmountError,
      isDerivedAddress,
    } = this.props

    updateSendAmountError({
      amount,
      amountConversionRate,
      balance,
      conversionRate,
      gasTotal,
      primaryCurrency,
      selectedToken,
      tokenBalance,
      isDerivedAddress,
    })

    if (selectedToken) {
      updateGasFeeError({
        amountConversionRate,
        balance,
        conversionRate,
        gasTotal,
        primaryCurrency,
        selectedToken,
        tokenBalance,
        isDerivedAddress,
      })
    }
  }

  updateAmount (amount) {
    const { updateSendAmount, setMaxModeTo } = this.props

    setMaxModeTo(false)
    updateSendAmount(amount)
  }

  updateGas (amount) {
    const { selectedToken, updateGas } = this.props

    if (selectedToken) {
      updateGas({ amount })
    }
  }

  handleChange = (newAmount) => {
    this.validateAmount(newAmount)
    this.updateGas(newAmount)
    this.updateAmount(newAmount)
  }

  renderInput () {
    const { amount, inError, selectedToken } = this.props
    const Component = selectedToken ? UserPreferencedTokenInput : UserPreferencedCurrencyInput

    return (
      <Component
        onChange={this.handleChange}
        error={inError}
        value={amount}
      />
    )
  }

  render () {
    const { gasTotal, inError } = this.props

    return (
      <SendRowWrapper
        label={`${this.context.t('amount')}:`}
        showError={inError}
        errorType="amount"
      >
        {gasTotal && <AmountMaxButton inError={inError} />}
        { this.renderInput() }
      </SendRowWrapper>
    )
  }

}
