import { useNavigate } from 'react-router-dom';
import PrimaryButton from '../components/PrimaryButton/PrimaryButton';
import GuestLanding from '../pages/LandingPage/LandingPage';

import { IoArrowBack } from '../../public/Icons.js'
import './styles.css';
import '../../public/styles/common.css';

function PreviewLanding() {
  const navigate = useNavigate();

  return (
    <div className="sa-preview-landing-content">
        <div className="preview-back-button">
            <PrimaryButton text="Back" onClick={() => navigate(-1)} />
        </div>
        <div className="preview-guest-landing">
            <GuestLanding />
        </div>
    </div>
  );
}

export default PreviewLanding