/* eslint-disable */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Content, Row, Col, Box, Inputs, Button } from 'adminlte-2-react'
import 'gatsby-ipfs-web-wallet/src/components/qr-scanner/qr-scanner.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import QrReader from 'react-qr-reader'
import { getWalletInfo } from 'gatsby-ipfs-web-wallet/src/components/localWallet'
const { Text } = Inputs
import ScannerModal from 'gatsby-ipfs-web-wallet/src/components/qr-scanner/modal'
import './split.css'
let _this

class Split extends React.Component {
  constructor(props) {
    super(props)

    _this = this

    this.props = props

    this.state = {
      WIF: '',
      ABCAddress: '',
      BCHNAddress: '',
      errMsg: '',
      txId: '',
      showScan: false,
      inFetch: false,
      showHelp: false,
      helpText: '',
      helpTitle: '',
      // BCHJSClass: props.bchWallet.BCHJS
    }

    // Object that contains data corresponding
    // to the selected modal
    _this.HELP_TEXT = {
      WIF: {
        modalTitle: 'WIF - Private Key',
        text: <p>
          This input requires the WIF private key from your paper wallet. This is the
          data encoded in the QR code of a paper wallet. It should start with the letter
          'K' or 'L' and be 52 characters long.
        </p>
      },
      BCHN: {
        modalTitle: 'BCHN Address',
        text: <p>
          This text box should contain the address on the BCHN chain where you'd like the
          split funds sent.
            </p>
      },
      ABC: {
        modalTitle: 'ABC Address',
        text: <div>
          <p>
            This text box should contain the address on the ABC chain where you'd like the
            split funds sent.
          </p>
          <p>
            This web wallet automatically follows the ABC chain. This text box is auto-populated
            with the address of this wallet. If you want to send the funds to a different
            address, replace it with the address of your desire.
          </p>
        </div>
      }
    }
  }

  render() {
    return (
      <>
        <Content>
          <Row>
            <Col sm={2} />
            <Col sm={8}>
              <Box
                loaded={!_this.state.inFetch}
                className="hover-shadow border-none mt-2"
              >
                <Row>
                  <Col sm={12} className="text-center">
                    <h1>
                      <FontAwesomeIcon
                        className="title-icon"
                        size="xs"
                        icon="paper-plane"
                      />
                      <span>Split</span>
                    </h1>
                    <p>
                      Split your BCH and SLP tokens between the BCHN and ABC
                      chains.
                    </p>

                    <p><big>
                      <b>Warning:</b> <u>Use this tool at your own risk!</u> This is an
                      automated tool. There is no tech support to help you if you
                      use it incorrectly.
                    </big></p>

                    <p>
                      This tool requires that you have BCH or SLP tokens stored
                      to a paper wallet <b>before</b> the chain split on November
                      15th, 2020.{' '}
                      <u>
                        Instructions on how to use this tool are available at
                        the bottom of the screen.
                      </u>
                    </p>
                    <Box className="border-none">
                      <Text
                        id="WIF"
                        name="WIF"
                        placeholder="Enter A Private Key (WIF)"
                        label="Private Key (WIF)"
                        labelPosition="above"
                        onChange={_this.handleUpdate}
                        className="title-icon"
                        value={_this.state.WIF}
                        buttonRight={
                          <Button
                            icon="fa-qrcode"
                            onClick={() => _this.handleModal('WIF')}
                          />
                        }
                        buttonLeft={
                          <Button
                            icon="fa-question"
                            onClick={() => _this.handleHelpModal('WIF')}
                          />
                        }
                      />

                      <Text
                        id="ABCAddress"
                        name="ABCAddress"
                        placeholder="Enter ABC Address"
                        label="ABC Address"
                        labelPosition="above"
                        value={_this.state.ABCAddress}
                        onChange={_this.handleUpdate}
                        buttonRight={
                          <Button
                            icon="fa-qrcode"
                            onClick={() => _this.handleModal('ABCAddress')}
                          />
                        }
                        buttonLeft={
                          <Button
                            icon="fa-question"
                            onClick={() => _this.handleHelpModal('ABC')}
                          />
                        }
                      />
                      <Text
                        id="BCHNAddress"
                        name="BCHNAddress"
                        placeholder="Enter BCHN Address"
                        label="BCHN Address"
                        labelPosition="above"
                        value={_this.state.BCHNAddress}
                        onChange={_this.handleUpdate}
                        buttonRight={
                          <Button
                            icon="fa-qrcode"
                            onClick={() => _this.handleModal('BCHNAddress')}
                          />
                        }
                        buttonLeft={
                          <Button
                            icon="fa-question"
                            onClick={() => _this.handleHelpModal('BCHN')}
                          />
                        }
                      />
                      <Button
                        text="Split"
                        type="primary"
                        className="btn-lg"
                        onClick={_this.handleSplit}
                      />
                    </Box>
                  </Col>
                  <Col sm={12} className="text-center">
                    {_this.state.errMsg && (
                      <p className="error-color">{_this.state.errMsg}</p>
                    )}
                    {_this.state.txId && (
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={`https://explorer.bitcoin.com/bch/tx/${
                          _this.state.txId
                          }`}
                      >
                        Transaction ID: {_this.state.txId}
                      </a>
                    )}
                  </Col>
                </Row>
              </Box>
            </Col>
            <Col sm={2} />
          </Row>
          <ScannerModal
            show={_this.state.showScan}
            handleOnHide={_this.onHandleToggleScanner}
            handleOnScan={_this.onHandleScan}
          />
          <Content
            title={_this.state.helpTitle}
            modal
            /*   modalFooter={this.modalFooter} */
            show={_this.state.showHelp}
            modalCloseButton
            onHide={_this.handleHelpModal}
          >
            {_this.state.helpText}
          </Content>

          <Content>
            <Row>
              <Col sm={2} />
              <Col sm={8}>
                <Box
                  loaded={!_this.state.inFetch}
                  className="hover-shadow border-none mt-2"
                >
                  <Row>
                    <Col sm={12} className="text-center">
                      <h2><u>Instructions</u></h2>
                      <p>
                        In order to use this tool, you must have a paper wallet
                        (or private key) holding BCH or SLP tokens <b>before</b>{' '}
                        the chain split on November 15th, 2020. This tool will
                        help you split your BCH and SLP tokens <b>after</b> the
                        chain split happens.
                      </p>
                      <p>
                        This video explains how to work with paper wallets. It
                        shows how to create them, how to send funds to them, and
                        how to retrieve funds from them.
                      </p>
                      <div className="video-background">
                      <iframe
                        width="100%"
                        min-height="450px"
                        src="https://www.youtube.com/embed/e1JxSirCiXM"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                      </div>

                      <br /><br />
                      <div className="video-background">
                      <iframe
                        width="100%"
                        min-height="450px"
                        src="https://www.youtube.com/embed/FigWfIPWXAE"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                      </div>

                    </Col>
                  </Row>
                </Box>
              </Col>
              <Col sm={2} />
            </Row>
          </Content>
        </Content>
      </>
    )
  }
  // Help modal controller
  handleHelpModal(from) {
    let helpText = ''
    let helpTitle = ''
    if (from) {
      helpText = _this.HELP_TEXT[from].text
      helpTitle = _this.HELP_TEXT[from].modalTitle
    }
    _this.setState({
      showHelp: !_this.state.showHelp, // Turn ON/OFF modal
      helpText, // Modal content
      helpTitle // Modal title
    })
  }
  componentDidMount() {
    _this.populateAddress()
  }

  // Populate the ABC address with the web wallet address, if the mnemonic for
  // the address has already been generated.
  populateAddress() {
    const { walletInfo } = _this.props
    const { mnemonic, cashAddress } = walletInfo
    if (mnemonic && cashAddress) {
      _this.setState({
        ABCAddress: cashAddress
      })
    }
  }

  async handleSplit() {
    try {
      // console.log('_this.props: ', _this.props)

      _this.validateInputs()

      // Turn on spinner
      _this.setState({
        inFetch: true,
        errMsg: ''
      })

      /*
       *
       * Split
       *
       *
       * */
      console.log(`ABC address: ${_this.state.ABCAddress}`)
      console.log(`BCHN address: ${_this.state.BCHNAddress}`)
      console.log(`WIF: ${_this.state.WIF}`)

      // Get Wallet Info
      const walletInfo = getWalletInfo()
      const slpAddress = walletInfo.slpAddress
      const WIFFromReceiver = walletInfo.privateKey

      if (!slpAddress || !WIFFromReceiver) {
        throw new Error(
          'You need to have a registered wallet to make a token sweep'
        )
      }

      const SplitLib = typeof window !== 'undefined' ? window.BchSplit : null
      if (!SplitLib) throw new Error('Splitting Library not found')

      if(!_this.props.bchWallet)
        throw new Error('BCHJS Class not passed as a prop.')
      const BCHJSClass = _this.props.bchWallet.BCHJS

      // Config object for the splitting library.
      const splitConfig = {
        dustServer: 'http://127.0.0.1:7654'
      }

      // Instancing the library
      const splitLib = new SplitLib(_this.state.WIF, WIFFromReceiver, BCHJSClass, splitConfig)
      await splitLib.getBlockchainData()

      // Constructing the sweep transaction
      const { hexAbc, hexBchn } = await splitLib.splitCoins(
        _this.state.ABCAddress,
        _this.state.BCHNAddress
      )
      // console.log(`transactionHex: `, transactionHex)

      // Broadcast the ABC transaction.
      const txidAbc = await splitLib.abcSweeper.blockchain.broadcast(hexAbc)
      console.log(`TXID for ABC transaction: ${txidAbc}`)

      // Comment out this code until after the chain split.
      // const txidBchn = await splitLib.bchnSweeper.blockchain.broadcast(hexBchn)
      console.log(`TX not broadcast on BCHN until after chain split.`)

      _this.resetValues()

      _this.setState({
        txId: txidAbc
      })
    } catch (error) {
      _this.handleError(error)
    }
  }

  handleUpdate(event) {
    const value = event.target.value
    _this.setState({
      [event.target.name]: value
    })
  }

  // Reset form and component state
  resetValues() {
    _this.setState({
      BCHNAddress: '',
      ABCAddress: '',
      WIF: '',
      errMsg: '',
      inFetch: false
    })
  }

  validateInputs() {
    const { WIF, ABCAddress, BCHNAddress } = _this.state

    if (!WIF) {
      throw new Error('WIF is required')
    }

    if (!ABCAddress) {
      throw new Error('ABC Address is required')
    }
    if (!BCHNAddress) {
      throw new Error('BCHN Address is required')
    }

    const isWIF = _this.validateWIF(WIF)
    if (!isWIF) {
      throw new Error('Private Key ( WIF ) has a wrong format ')
    }

    const isABCAddress = _this.validateAddress(ABCAddress)
    if (!isABCAddress) {
      throw new Error('ABC Address  has wrong format ')
    }

    const isBCHNAddress = _this.validateAddress(BCHNAddress)
    if (!isBCHNAddress) {
      throw new Error('BCHN Address  has wrong format ')
    }
  }
  // Show/Hide QR Scanner
  onHandleToggleScanner() {
    _this.setState({
      showScan: !_this.state.showScan
    })
  }

  handleModal(from) {
    const scannerFrom = from || ''
    _this.setState({
      showScan: !_this.state.showScan,
      scannerFrom
    })
  }

  resetWIFValue() {
    _this.setState({
      WIF: '',
      errMsg: ''
    })
  }

  // Populates WIF text field
  onScanWIF(data) {
    try {
      _this.resetWIFValue()
      // Validate Input
      const isWIF = _this.validateWIF(data)
      if (!isWIF) {
        throw new Error('Not a WIF key')
      }
      _this.setState({
        WIF: data,
        errMsg: ''
      })
    } catch (error) {
      throw error
    }
  }

  // Populates the BCHNAddress text field
  onScanBCHN(data) {
    try {
      _this.setState({
        BCHNAddress: '',
        errMsg: ''
      })
      // Validate Input
      const isAddress = _this.validateAddress(data)
      if (!isAddress) {
        throw new Error('BCHN Address must be a BCH or SLP Address')
      }
      _this.setState({
        BCHNAddress: data,
        errMsg: ''
      })
    } catch (error) {
      throw error
    }
  }
  // Populates the ABCAddress text field
  onScanABC(data) {
    try {
      _this.setState({
        ABCAddress: '',
        errMsg: ''
      })
      // Validate Input
      const isAddress = _this.validateAddress(data)
      if (!isAddress) {
        throw new Error('ABC Address must be a BCH or SLP Address')
      }
      _this.setState({
        ABCAddress: data,
        errMsg: ''
      })
    } catch (error) {
      throw error
    }
  }
  // QR Scanner controller
  onHandleScan(data) {
    try {
      if (!data) {
        throw new Error('No Result!')
      }
      if (typeof data !== 'string') {
        throw new Error('It should scan a bch address,a slp address or WIF')
      }
      const { scannerFrom } = _this.state

      switch (scannerFrom) {
        case 'WIF':
          _this.onScanWIF(data)
          break
        case 'BCHNAddress':
          _this.onScanBCHN(data)
          break
        case 'ABCAddress':
          _this.onScanABC(data)
          break
      }
      _this.onHandleToggleScanner()
    } catch (error) {
      _this.onHandleToggleScanner()
      _this.setState({
        errMsg: error.message
      })
    }
  }

  handleError(error) {
    // console.error(error)
    let errMsg = ''
    if (error.message) {
      errMsg = error.message
    }
    if (error.error) {
      if (error.error.match('rate limits')) {
        errMsg = (
          <span>
            Rate limits exceeded, increase rate limits with a JWT token from
            <a
              style={{ marginLeft: '5px' }}
              target="_blank"
              href="https://fullstack.cash"
              rel="noopener noreferrer"
            >
              FullStack.cash
            </a>
          </span>
        )
      } else {
        errMsg = error.error
      }
    }
    _this.setState(prevState => {
      return {
        ...prevState,
        errMsg,
        txId: '',
        inFetch: false
      }
    })
  }

  validateWIF(WIF) {
    if (typeof WIF !== 'string') {
      return false
    }

    if (WIF.length !== 52) {
      return false
    }

    if (WIF[0] !== 'L' && WIF[0] !== 'K') {
      return false
    }

    return true
  }

  validateAddress(address) {
    let isValid = false
    const isBch = address.match('bitcoincash:')
    const isSlp = address.match('simpleledger:')

    if (isBch || isSlp) {
      isValid = true
    }

    return isValid
  }
}

Split.propTypes = {
  walletInfo: PropTypes.object
}

export default Split
