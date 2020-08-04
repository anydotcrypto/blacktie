import { connect } from 'react-redux'
import PermissionPageContainer from './permission-page-container.component'
import {
  getPermissionsDescriptions,
  getTargetDomainMetadata,
  getBlackTieIdentities,
} from '../../../selectors'

const mapStateToProps = (state, ownProps) => {
  const { request, cachedOrigin, selectedIdentities } = ownProps
  const targetDomainMetadata = getTargetDomainMetadata(state, request, cachedOrigin)

  const allIdentities = getBlackTieIdentities(state)
  const allIdentitiesSelected = Object.keys(selectedIdentities).length === Object.keys(allIdentities).length

  return {
    permissionsDescriptions: getPermissionsDescriptions(state),
    targetDomainMetadata,
    allIdentitiesSelected,
  }
}

export default connect(mapStateToProps)(PermissionPageContainer)
