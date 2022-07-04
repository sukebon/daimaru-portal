import type { NextPage } from 'next';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

type Props = {
  value1: number;
  value2: number;
  value3: number;
  value4: number;
};

const PieChart: NextPage<Props> = ({ value1, value2, value3, value4 }) => {
  // const labels = ['修正処置', '書面提出', '改善の機会', '是正処置'];
  ChartJS.register(ArcElement, Tooltip, Legend);
  const data = {
    labels: ['修正処置', '書面提出', '改善の機会', '是正処置'],
    datasets: [
      {
        label: '# of Votes',
        data: [value1, value2, value3, value4],
        backgroundColor: [
          'rgba(54, 162, 235, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(255, 99, 132, 0.2)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
  return (
    <div className='App'>
      <Pie data={data} />
    </div>
  );
};

export default PieChart;
