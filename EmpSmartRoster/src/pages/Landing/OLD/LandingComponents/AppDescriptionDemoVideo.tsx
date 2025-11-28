import "./AppDescriptionDemoVideo.css";
import appDescriptionIcon1 from './appDescriptionIcon1.png';
import appDescriptionIcon2 from './appDescriptionIcon2.png';
import appDescriptionIcon3 from './appDescriptionIcon3.png';
import sampleVideo from './sampleVideo.png';

export default function AppDescriptionDemo({ className = "" }: AppDescriptionDemoProps) {
  return (
    <div className={`${className} app-description-container`}>
      <div className="app-description-content">
        <div className="app-description-text fade-in-up fade-delay-1">
          <span>
            {/* Time Management */}
            <p>Time Management</p>
            <div className="spacer" />
            <p className="section-title">
              <table>
                <tbody>
                  <tr>
                    <td>Efficient Scheduling</td>
                    <td className="icon-container">
                      <img className="icon" src={appDescriptionIcon1} alt="Time Management Icon" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </p>
            <div className="spacer" />
            <p>
              Efficiently manage employee shifts and schedules with our intuitive platform. Our system simplifies the process, ensuring smooth operations and effective utilization of resources.
            </p>
            <div className="spacer" />

            {/* Communication */}
            <p>Communication</p>
            <div className="spacer" />
            <p className="section-title">
              <table>
                <tbody>
                  <tr>
                    <td>Seamless Collaboration</td>
                    <td className="icon-container">
                      <img className="icon" src={appDescriptionIcon2} alt="Communication Icon" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </p>
            <div className="spacer" />
            <p>
              Facilitate seamless communication among team members with EmployeeRoster. Our application fosters collaboration, ensuring everyone is informed and connected.
            </p>
            <div className="spacer" />

            {/* Productivity */}
            <p>Productivity</p>
            <div className="spacer" />
            <p className="section-title">
              <table>
                <tbody>
                  <tr>
                    <td>Boost Efficiency</td>
                    <td className="icon-container">
                      <img className="icon" src={appDescriptionIcon3} alt="Productivity Icon" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </p>
            <div className="spacer" />
            <p>Maximize productivity within your business by utilizing EmployeeRoster's features.</p>
            <p>Our tools are designed to streamline operations, reduce errors, and increase overall efficiency.</p>
          </span>
        </div>

        {/* Demo Video Section */}
        <div className="app-description-video fade-in-up fade-delay-2">
          <img className="video-thumbnail" src={sampleVideo} loading="lazy" alt="Demo Video" />
        </div>
      </div>
    </div>
  );
}

interface AppDescriptionDemoProps {
  className?: string;
}
