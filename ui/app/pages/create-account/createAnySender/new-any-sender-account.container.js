import { connect } from 'react-redux'
import * as actions from '../../../store/actions'
import NewAnySenderAccountCreateForm from './new-any-sender-account.component'

const mapStateToProps = (state) => {
  const { metamask: { network, selectedAddress, identities = {} } } = state
  const numberOfExistingAccounts = Object.keys(identities).length
  const newAccountNumber = numberOfExistingAccounts + 1

  return {
    network,
    address: selectedAddress,
    newAccountNumber,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    createAccount: (newAccountName) => {
      return dispatch(actions.addNewAnySenderAccount())
        .then((newAccountAddress) => {
          if (newAccountName) {
            dispatch(actions.setAccountLabel(newAccountAddress, newAccountName))
          }
        })
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewAnySenderAccountCreateForm)
