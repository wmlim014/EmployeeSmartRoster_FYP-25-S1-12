import { useAlert } from './AlertContext';
import './Alert.css';
import { IoClose } from '../../../public/Icons.js';

const Alert = () => {
  const { alert, hideAlert } = useAlert();

  if (!alert.visible) return null;

  return (
    <div className={`alert-container alert-${alert.type}`}>
      <div className="alert-title">
        <h3>{alert.title}</h3>
        {alert.closable && (
          <button className="icons" onClick={hideAlert}>
            <IoClose />
          </button>
        )}
      </div>
      <div className="alert-content">
        <p className="alert-content-content">
          {alert.content}
        </p>
        <span>{alert.message}</span>
      </div>
    </div>
  );
};

export default Alert;