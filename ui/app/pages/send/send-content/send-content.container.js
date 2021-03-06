import { connect } from 'react-redux'
import SendContent from './send-content.component'
import {
  getSendTo,
} from '../send.selectors'
import {
  accountsWithSendEtherInfoSelector,
  getAddressBookEntry,
  selectedAccountIsDerived,
} from '../../../selectors'
import * as actions from '../../../store/actions'

function mapStateToProps (state) {
  const ownedAccounts = accountsWithSendEtherInfoSelector(state)
  const to = getSendTo(state)
  const isDerivedAddress = selectedAccountIsDerived(state)
  return {
    isOwnedAccount: !!ownedAccounts.find(({ address }) => address.toLowerCase() === to.toLowerCase()),
    contact: getAddressBookEntry(state, to),
    to,
    isDerivedAddress,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    showAddToAddressBookModal: (recipient) => dispatch(actions.showModal({
      name: 'ADD_TO_ADDRESSBOOK',
      recipient,
    })),
  }
}

function mergeProps (stateProps, dispatchProps, ownProps) {
  const { to, ...restStateProps } = stateProps
  return {
    ...ownProps,
    ...restStateProps,
    showAddToAddressBookModal: () => dispatchProps.showAddToAddressBookModal(to),
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(SendContent)
