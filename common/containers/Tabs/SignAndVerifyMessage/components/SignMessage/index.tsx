import React, { Component } from 'react';
import { connect } from 'react-redux';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import translate, { translateRaw } from 'translations';
import { ISignedMessage } from 'libs/signing';
import { IFullWallet } from 'libs/wallet';
import { AppState } from 'features/reducers';
import { messageActions } from 'features/message';
import { walletActions, walletSelectors } from 'features/wallet';
import WalletDecrypt, { DISABLE_WALLETS } from 'components/WalletDecrypt';
import { TextArea, CodeBlock } from 'components/ui';
import Principles from './messages/principles';
import SignButton from './SignButton';
import './index.scss';

interface Props {
  wallet: IFullWallet;
  unlocked: boolean;
  signMessageRequested: messageActions.TSignMessageRequested;
  signedMessage: ISignedMessage | null;
  resetWallet: walletActions.TResetWallet;
  resetMessage: messageActions.TResetMessage;
}

interface State {
  message: string;
}

const initialState: State = {
  message: Principles
};

const postToWhisper = signedMessage => {
  const msg = JSON.stringify(signedMessage, null, 2);
  window.opener.postMessage(
    {type: 'whisperMsg', msg, channel: 'mytest' },
    '*'
  );



}
const messagePlaceholder = translateRaw('SIGN_MSG_PLACEHOLDER');

export class SignMessage extends Component<Props, State> {
  public state: State = initialState;

  public componentWillUnmount() {
    this.props.resetWallet();
    this.props.resetMessage();
  }

  public render() {
    const { unlocked, signedMessage } = this.props;
    const { message } = this.state;

    return (
      <div>
        {unlocked ? (
           <div className="Tab-content-pane">
             <button
               className="SignMessage-reset btn btn-default btn-sm"
               onClick={this.changeWallet}
             >
               <i className="fa fa-refresh" />
               {translate('CHANGE_WALLET')}
             </button>

             <div className="input-group-wrapper Deploy-field">
               <label className="input-group">
                 <div className="input-group-header">{translate('MSG_MESSAGE')}</div>
                 <TextArea
                   isValid={!!message}
                   className="SignMessage-inputBox"
                   placeholder={messagePlaceholder}
                   value={message}
                   onChange={this.handleMessageChange}
                 />
               </label>
               <div className="SignMessage-help">{translate('MSG_INFO2')}</div>
             </div>
             <div>
               <SignButton
                 message={this.state.message}
                 signMessageRequested={this.props.signMessageRequested}
               />
             </div>

             {signedMessage && (
                <div className="input-group-wrapper SignMessage-inputBox">
                  <CopyToClipboard
                    text={JSON.stringify(signedMessage, null, 2)}
                    onCopy={() => {
                      this.setState({ copied: true });
                    }}
                  >
                    <label
                      className="input-group"
                      style={{ color: this.state.copied ? 'green' : null }}
                    >
                      <div className="input-group-header">
                        {translate('MSG_SIGNATURE')} (Click or touch to copy to clipboard)
                      </div>
                      <CodeBlock
                        className="SignMessage-inputBox"
                        color={this.state.copied ? 'green' : null}
                      >
                        {JSON.stringify(signedMessage, null, 2)}
                      </CodeBlock>
                    </label>
                  </CopyToClipboard>
                  <button onClick={() => { postToWhisper(signedMessage) }}>
                    Broadcast to Status
                  </button>
                </div>
             )}
           </div>
        ) : (
           <WalletDecrypt hidden={unlocked} disabledWallets={DISABLE_WALLETS.UNABLE_TO_SIGN} />
        )}
      </div>
    );
  }

  private handleMessageChange = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const message = e.currentTarget.value;
    this.setState({ message });
  };

  private changeWallet = () => {
    this.props.resetWallet();
    this.props.resetMessage();
    this.setState(initialState);
  };
}

const mapStateToProps = (state: AppState) => ({
  signedMessage: state.message.signed,
  unlocked: walletSelectors.isWalletFullyUnlocked(state)
});

export default connect(mapStateToProps, {
  signMessageRequested: messageActions.signMessageRequested,
  resetWallet: walletActions.resetWallet,
  resetMessage: messageActions.resetMessage
})(SignMessage);
