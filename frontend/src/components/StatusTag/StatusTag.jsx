import { Tag } from 'antd';
import { peerReviewStatus } from '../../constants/enums';

const StatusTag = ({ status, isReviewee }) => {
  if (status === peerReviewStatus.PENDING) {
    return <Tag color="cyan">Pending</Tag>;
  } else if (status === peerReviewStatus.COMPLETE) {
    return <Tag color="green">Complete</Tag>;
  } else if (status === peerReviewStatus.DECLINED) {
    return <Tag color="red">Declined</Tag>;
  } else if (status === peerReviewStatus.DRAFT) {
    return <Tag color="purple">Draft</Tag>;
  } else if (status === peerReviewStatus.REVIEW_DRAFT) {
    return isReviewee ? (
      <Tag color="gold">Awaiting Peer Review</Tag>
    ) : (
      <Tag color="geekblue">Review Draft</Tag>
    );
  } else if (status === peerReviewStatus.AWAITING_PEER_REVIEW) {
    return <Tag color="gold">Awaiting Peer Review</Tag>;
  } else if (status === peerReviewStatus.AWAITING_ACTION_PLAN) {
    return <Tag color="gold">Awaiting Action Plan</Tag>;
  } else {
    return <Tag color="red">None</Tag>;
  }
};

export default StatusTag;
