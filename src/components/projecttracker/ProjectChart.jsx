import React, { useEffect, useState } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { useAuth } from '../../../context/AuthContext';

export const ProjectChart = (props) => {
    const {clientId, projectId} = props;

    // console.log("Client ID:", clientId, "Project ID:", projectId);

    const { chartInformationDetails } = useAuth();
    const [chartDetails, setChartDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchChartDetails = async () => {
        setLoading(true);
        try {
            // console.log("Client ID:",clientId);
            const chartData = await chartInformationDetails(clientId, projectId); 
            setChartDetails(chartData);
        } catch (error) {
            console.error("Error fetching chart details:", error.message);
        } finally {
            setLoading(false);
        }
    };

    const [chartHeight, setChartHeight] = useState(400);


useEffect(() => {
    const updateChartSize = () => {
        if (window.innerWidth < 768) {
            setChartHeight(300); 
        } else {
            setChartHeight(400); 
        }
    };

    window.addEventListener('resize', updateChartSize);
    updateChartSize(); 

    return () => window.removeEventListener('resize', updateChartSize);
}, []);


    useEffect(() => {
        fetchChartDetails();
    }, [chartInformationDetails]);

    if (loading) return <p>Loading...</p>;

    if (!chartDetails || !chartDetails.status_counts) {
        return <p>No chart details available.</p>;
    }

    const valueFormatter = (item) => `${item.value}%`;

    const desktopOS = [
        { label: 'Open', value: chartDetails.status_counts.Open },
        { label: 'High', value: chartDetails.status_counts.High },
        { label: 'Normal', value: chartDetails.status_counts.Normal },
        { label: 'On-Hold', value: chartDetails.status_counts['On-Hold'] },
        { label: 'Delivered', value: chartDetails.status_counts.Delivered },
        { label: 'Re-work', value: chartDetails.status_counts['Re-work'] },
        { label: 'Quality Check', value: chartDetails.status_counts['Quality Check'] },
        { label: 'Closed', value: chartDetails.status_counts.Closed },
        { label: 'Pending', value: chartDetails.status_counts.Pending },
    ];

    const colors = ['#FF5733', '#33FF57', '#3357FF', '#F0E130', '#A569BD', '#F39C12', '#16A085', '#E74C3C', '#3498DB'];

    return (
        <div className="chart-container" style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', width:"100%"}}>
            <div className="graphs">
                <PieChart
                    colors={colors}
                    series={[
                        {
                            data: desktopOS,
                            highlightScope: { fade: 'global', highlight: 'item' },
                            faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                            valueFormatter,
                        },
                    ]}
                    height={chartHeight}
                    width={800}
                />
            </div>
        </div>
    );
};

