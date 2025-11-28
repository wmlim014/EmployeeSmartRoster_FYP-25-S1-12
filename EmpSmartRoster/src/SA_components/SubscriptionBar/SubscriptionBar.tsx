import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import SubscribtionController from "../../../controller/SubscribtionController";
import "./SubscriptionBar.css";
import "../../../../public/styles/common.css";

// Access the function from the default export
const { GetSubscriptionData } = SubscribtionController;

const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

const SubscriptionBar = () => {

    function getSubscriptionData() {
        return GetSubscriptionData();
    } 

  return (
    <div style={{ width: '100%', height: 400, margin: '20px auto' }}>
      <h1>Subscription Plans Distribution</h1>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={getSubscriptionData()}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis 
            dataKey="name" 
            tick={{ fill: '#333' }}
            axisLine={{ stroke: '#ccc' }}
          />
          <YAxis 
            label={{ 
              value: 'Number of Subscriptions', 
              angle: -90, 
              position: 'insideLeft',
              fill: '#333'
            }}
          />
          <Tooltip 
            formatter={(value: number) => [`${value} Subscriptions`, 'Count']}
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            formatter={(value) => <span style={{ color: '#333' }}>{value}</span>}
          />
          <Bar
            dataKey="value"
            name="Subscription Count"
            fill="#8884d8"
            radius={[4, 4, 0, 0]}
          >
            {getSubscriptionData().map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SubscriptionBar;
