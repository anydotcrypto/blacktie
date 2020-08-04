import { connect } from 'react-redux'
import Balance from './balance.component'
import {
  getNativeCurrency,
  getAssetImages,
  conversionRateSelector,
  getCurrentCurrency,
  getBlackTieAccounts,
  getIsMainnet,
  preferencesSelector,
} from '../../../selectors'

const mapStateToProps = (state) => {
  const { showFiatInTestnets } = preferencesSelector(state)
  const isMainnet = getIsMainnet(state)
  const accounts = getBlackTieAccounts(state)
  const network = state.metamask.network
  const selectedAddress = state.metamask.selectedAddress || Object.keys(accounts)[0]
  const account = accounts[selectedAddress]

  return {
    account,
    network,
    nativeCurrency: getNativeCurrency(state),
    conversionRate: conversionRateSelector(state),
    currentCurrency: getCurrentCurrency(state),
    assetImages: getAssetImages(state),
    showFiat: (isMainnet || !!showFiatInTestnets),
  }
}

export default connect(mapStateToProps)(Balance)
