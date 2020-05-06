const utils_1 = require('ethers/utils')
const data_entities_1 = require('@any-sender/data-entities')
const contracts_1 = require('@any-sender/contracts')
/**
 * Client library for interacting with the any.sender API
 */
export class AnyDotSenderCoreClient extends data_entities_1.ApiClient {
  /**
   * Client library for interacting with the any.sender API
   * @param config Configuration options for this client
   * @param mockService Optional. If provided the mock service will be used as any.sender instead of the config
   */
  constructor (config, mockService) {
    super(config.apiUrl)
    this.mockService = mockService
    this.receiptsignerAddress = config.receiptSignerAddress
  }
  /**
   * Computes the id of a relay transaction
   * @param relayTransaction
   */
  static relayTxId (relayTransaction) {
    return new data_entities_1.UnsignedRelayTransactionWrapper(relayTransaction)
      .id
  }
  /**
   * Gets the topics needed to watch for a RelayExecuted event
   * @param relayTransaction
   */
  static getRelayExecutedEventTopics (relayTransaction) {
    const relayInterface = new contracts_1.RelayFactory().interface
    return relayInterface.events.RelayExecuted.encodeTopics([
      AnyDotSenderCoreClient.relayTxId(relayTransaction),
      null,
      null,
      null,
      null,
      null,
    ])
  }
  /**
   * Fetch the user's balance from the any.sender payment gateway service
   * All public information via the blockchain, so API provides easy access.
   * @param address Ethereum account
   */
  async balance (address) {
    if (this.mockService) {
      return this.mockService.balance(address)
    }
    const serialisation = await this.executeGetRequest(
      data_entities_1.PaymentGatewayRoutes.BALANCE_ROUTE + '/' + address
    )
    return new utils_1.BigNumber(serialisation.balance)
  }
  /**
   * Check that the returned receipt was correctly signed
   * @param receipt
   */
  async isValidReceipt (receipt) {
    const transactionWrapper = new data_entities_1.UnsignedRelayTransactionWrapper(
      receipt.relayTransaction
    )
    if (transactionWrapper.id !== receipt.id) {
      throw new data_entities_1.InvalidReceiptIdError(
        'The returned receipt id is invalid.',
        receipt.relayTransaction,
        receipt.id
      )
    }
    const recoveredAddress = utils_1.verifyMessage(
      utils_1.arrayify(transactionWrapper.id),
      receipt.receiptSignature
    )
    if (
      recoveredAddress.toLowerCase() !== this.receiptsignerAddress.toLowerCase()
    ) {
      throw new data_entities_1.InvalidReceiptSignatureError(
        'The returned relayer signature is invalid.',
        receipt.relayTransaction,
        receipt.receiptSignature
      )
    }
  }
  /**
   * Relay a transaction via the any.sender API
   * @param relayTransaction
   */
  async relay (relayTransaction) {
    const receipt = this.mockService
      ? await this.mockService.relay(relayTransaction)
      : await this.executePostRequest(
        relayTransaction,
        data_entities_1.RELAY_ROUTE
      )
    // check the receipt
    await this.isValidReceipt(receipt)
    return receipt
  }
}
