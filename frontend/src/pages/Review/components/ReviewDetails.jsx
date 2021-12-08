import { Descriptions } from 'antd';
import { useAppContext } from '../../../context/AppContextProvider';
import { useTabletAndBelowMediaQuery } from '../../../utils/media-breakpoints';
import { peerReviewStatus } from '../../../constants/enums';

const ReviewDetails = ({ details }) => {
  const { reviewee, reviewer, reason, course, course_description, request_response, status } =
    details;

  const { user } = useAppContext();

  const isSmallScreen = useTabletAndBelowMediaQuery();

  // is the user a reviewer
  const isReviewer = details?.reviewer.id.toString() === user.id.toString();

  return (
    <Descriptions
      bordered
      size="small"
      labelStyle={{ width: '15%', verticalAlign: 'text-top' }}
      contentStyle={{ textAlign: 'left' }}
      column={2}
    >
      {isReviewer ? (
        <>
          <Descriptions.Item label="Reviewee" span={isSmallScreen ? 2 : 1}>
            {reviewee.name}
          </Descriptions.Item>
          <Descriptions.Item label="Email" span={isSmallScreen ? 2 : 1}>
            <a href={`mailto:${reviewee.upi}@auckland.ac.nz`}>{reviewee.upi + '@auckland.ac.nz'}</a>
          </Descriptions.Item>
        </>
      ) : (
        <>
          <Descriptions.Item label="Reviewer" span={isSmallScreen ? 2 : 1}>
            {reviewer.name}
          </Descriptions.Item>
          <Descriptions.Item label="Email" span={isSmallScreen ? 2 : 1}>
            <a href={`mailto:${reviewer.upi}@auckland.ac.nz`}>{reviewer.upi + '@auckland.ac.nz'}</a>
          </Descriptions.Item>
        </>
      )}

      <Descriptions.Item label="Course" span={2}>
        {course}
      </Descriptions.Item>

      <Descriptions.Item label="Course Description" span={2}>
        {course_description}
      </Descriptions.Item>

      <Descriptions.Item label="Reason for request" span={2}>
        {reason}
      </Descriptions.Item>

      {request_response && status !== peerReviewStatus.DRAFT && (
        <Descriptions.Item
          label={status === peerReviewStatus.DECLINED ? 'Decline message' : 'Response message'}
          span={2}
        >
          {request_response}
        </Descriptions.Item>
      )}
    </Descriptions>
  );
};

export default ReviewDetails;
