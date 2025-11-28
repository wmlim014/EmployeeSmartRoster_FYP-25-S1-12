// import "./landing.css";
import logo from '../../../public/assets/Logo.png';

const GuestLanding = () => {
  return (
    <div>

{/* Top Nav Bar */}
        <div>
        
          <ul>
          <img src={logo} alt="Logo" />
            <li><a className="active" href="#home">Home</a></li>
            <li><a href="#news">Register</a></li>
            <li><a href="#contact">Login</a></li>
          </ul>
        </div>

{/* Header */}
        <div>
        <table>
          <tr>
           <th>EmpRoster</th>
          </tr>

          <tr>
           <td className="subHeader">Simplify Employee Scheduling and Timesheets</td>
          </tr>

          <tr>
            <td>Discover how EmployeeRoster can streamline your employee scheduling process. <br/>
            Our innovative application is designed to enhance operational efficiency and boost employee satisfaction.</td>
          </tr>
        </table>
        </div>

{/* Our Solutions */}
        <div>
        <table className="solutions">
          <tr>
           <th>Our Solutions</th>
          </tr>

          <tr>
           <td className="solutions2"> Optimize Your Business</td>
          </tr>

          <tr>
            <td>EmployeeRoster provides cutting-edge solutions to revolutionize your roster management. By implementing our tools, you can efficiently organize employee schedules, improve operational effectiveness, and enhance overall productivity.</td>
          </tr>
        </table>
        </div>

        {/* Benefits and video */}
        <div>

          
        <table>
<tr>
<td>Time Management
Efficient Scheduling

Efficiently manage employee shifts and schedules with our intuitive platform. Our system simplifies the process, ensuring smooth operations and effective utilization of resources.

</td>
<td>IMG</td>
</tr>
  <tr>

    <td>1</td>
    <td>IMG</td>
    <td rowSpan={3}>$50</td>
  </tr>
  <tr>
    <td>2</td>
        <td>IMG</td>
  </tr>
</table>
        </div>


{/* end of parent div  */}
</div> 


      );
}

interface guestLandingPage {
  className?: string;
}

export default GuestLanding;