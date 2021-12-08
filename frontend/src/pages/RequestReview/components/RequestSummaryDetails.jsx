import { Descriptions, Typography } from 'antd';

const { Paragraph, Text } = Typography;

const RequestSummary = ({ details }) => {
  const { reviewer, reason, course, course_description, aspects } = details;

  return (
    <Descriptions
      title="Peer Review Request Summary"
      bordered
      size="small"
      labelStyle={{ minWidth: '15%', verticalAlign: 'text-top' }}
      contentStyle={{ textAlign: 'left' }}
      column={1}
    >
      <Descriptions.Item label="Reviewer">{reviewer.name}</Descriptions.Item>
      <Descriptions.Item label="Reason for request">{reason}</Descriptions.Item>
      <Descriptions.Item label="Course">{course}</Descriptions.Item>
      <Descriptions.Item label="Course Description">{course_description}</Descriptions.Item>
      <Descriptions.Item label="Comments">
        {aspects.map((aspect, key) => (
          <div key={key}>
            <Text strong>{aspect.aspect_name}</Text>
            <Paragraph>{aspect.reviewee_comments}</Paragraph>
          </div>
        ))}
      </Descriptions.Item>
    </Descriptions>
  );
};

export default RequestSummary;
