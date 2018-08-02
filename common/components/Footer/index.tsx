import React from 'react';

import { translateRaw } from 'translations';
import logo from 'assets/images/logo-mycrypto.svg';
import {
  donationAddressMap,
  VERSION,
  knowledgeBaseURL,
  socialMediaLinks,
  productLinks,
  affiliateLinks,
  partnerLinks
} from 'config';
import DisclaimerModal from 'components/DisclaimerModal';
import { NewTabLink } from 'components/ui';
import PreFooter from './PreFooter';
import ThemeToggle from './ThemeToggle';
import './index.scss';

const SocialMediaLink = ({ link, text }: { link: string; text: string }) => {
  return (
    <NewTabLink className="SocialMediaLink" key={link} href={link} aria-label={text}>
      <i className={`sm-icon sm-logo-${text}`} />
    </NewTabLink>
  );
};

interface Props {
  latestBlock: string;
}

interface State {
  isDisclaimerOpen: boolean;
}

export default class Footer extends React.PureComponent<Props, State> {
  public state: State = {
    isDisclaimerOpen: false
  };

  public render() {
    return (
      <div>
        <PreFooter openModal={this.toggleModal} />
      </div>
    );
  }

  private toggleModal = () => {
    this.setState(state => {
      this.setState({ isDisclaimerOpen: !state.isDisclaimerOpen });
    });
  };
}
