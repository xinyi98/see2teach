import { useAppContext } from '../../context/AppContextProvider';
import { useState, useEffect } from 'react';
import { getAllReviews } from '../../api/PeerReviewApi';
import { peerReviewStatus } from '../../constants/enums';
import { Bar } from '@ant-design/charts';
import { Typography } from 'antd';

const { Title, Paragraph } = Typography;
const introduction = `See2Teach is web application for supporting the peer review of teaching 
in the University of Auckland. It is a refined peer review system that can better help to 
improve teachers’ own skills and enhance the students’ learning experience.`;

const Dashboard = () => {
  const { user } = useAppContext();

  // as a reviewee
  const [awaiting_action_plan, setAwaiting_action_plan] = useState(0);

  // as a reviewer
  const [pending, setPending] = useState(0);
  const [review_draft, setReview_draft] = useState(0);
  const [awaiting_your_peer_review, setAwaiting_your_peer_review] = useState(0);

  useEffect(() => {
    // as a reviewee
    getAllReviews(user.id, 'reviewee')
      .then((res) => {
        let awaiting_action_planCount = 0;
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].status.toLowerCase() === peerReviewStatus.AWAITING_ACTION_PLAN) {
            awaiting_action_planCount++;
          }
        }

        setAwaiting_action_plan(awaiting_action_planCount);
      })
      .catch((err) => console.log(err));

    // as a reviewer
    getAllReviews(user.id, 'reviewer').then((res) => {
      let awaiting_your_peer_reviewCount = 0,
        pendingCount = 0,
        review_draftCount = 0;
      for (let i = 0; i < res.data.length; i++) {
        if (res.data[i].status.toLowerCase() === peerReviewStatus.AWAITING_PEER_REVIEW) {
          awaiting_your_peer_reviewCount++;
        } else if (res.data[i].status.toLowerCase() === peerReviewStatus.PENDING) {
          pendingCount++;
        } else if (res.data[i].status.toLowerCase() === peerReviewStatus.REVIEW_DRAFT) {
          review_draftCount++;
        }
      }
      setAwaiting_your_peer_review(awaiting_your_peer_reviewCount);
      setPending(pendingCount);
      setReview_draft(review_draftCount);
    });
  }, [user]);

  const data = [
    { status: 'Pending', value: pending },
    { status: 'Awaiting Your Peer Review', value: awaiting_your_peer_review },
    { status: 'Review Draft', value: review_draft },
    { status: 'Awaiting Action Plan', value: awaiting_action_plan },
  ];

  const config = {
    data: data,
    xField: 'value',
    yField: 'status',
    seriesField: 'status',
    legend: { position: 'top-left' },
  };

  return (
    <div>
      <Title>Welcome to See2Teach</Title>
      <Paragraph style={{ padding: '1.5%' }}>{introduction}</Paragraph>
      <h3>Peer Reviews Awaiting Your Response:</h3>
      <Bar {...config} />
    </div>
  );
};

export default Dashboard;
