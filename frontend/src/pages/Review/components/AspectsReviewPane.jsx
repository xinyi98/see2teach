import { Steps, Input, Typography, Space, Form, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import ActionPointSection from './ActionPointSection';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { getAspects } from '../../../api/PeerReviewApi';

const { TextArea } = Input;
const { Step } = Steps;
const { Title, Text, Paragraph } = Typography;

const AspectsReviewPane = ({ aspects, dispatch, isEditable, showReview }) => {
  const [aspectDescriptions, setAspectDescriptions] = useState({});

  useEffect(() => {
    getAspects().then(({ data }) => {
      const descriptions = data.reduce(
        (newObj, item) => Object.assign(newObj, { [item.name]: item.description }),
        {}
      );
      setAspectDescriptions(descriptions);
    });
  }, []);

  const updateReview = (aspect_name, review) => {
    dispatch({ type: 'setReview', aspect_name, review });
  };

  return (
    <>
      <Steps progressDot direction="vertical">
        {aspects.map((aspect, key) => {
          return (
            <Step
              key={key}
              status="process"
              style={{ paddingBottom: 24 }}
              id={`aspect-${aspect.aspect_name.replace(/ /g, '-')}`}
              title={
                <Title level={4} style={{ marginTop: -4 }}>
                  {aspect.aspect_name}
                  {aspect.aspect_name !== 'General' && (
                    <Tooltip
                      placement="right"
                      title={aspectDescriptions[aspect.aspect_name]}
                      overlayInnerStyle={{ width: 400 }}
                    >
                      <QuestionCircleOutlined
                        data-testid={`aspects-tooltip-${key}`}
                        style={{ marginLeft: 14, cursor: 'help' }}
                      />
                    </Tooltip>
                  )}
                </Title>
              }
              description={
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <Text>
                    <Text strong>Reviewee's Comments:</Text>
                    <Paragraph style={{ marginBottom: 0 }}>{aspect.reviewee_comments}</Paragraph>
                  </Text>

                  {isEditable ? (
                    <Form layout="vertical">
                      <Form.Item label={<Text strong>Feedback</Text>}>
                        <TextArea
                          value={aspect.review}
                          rows={4}
                          onChange={(e) => updateReview(aspect.aspect_name, e.target.value)}
                        />
                      </Form.Item>

                      <Text strong>Action Points</Text>

                      <ActionPointSection
                        aspectName={aspect.aspect_name}
                        actionPoints={aspect.action_points}
                        dispatch={dispatch}
                      />
                    </Form>
                  ) : (
                    showReview && ( // status is not request draft or pending or declined
                      <div>
                        {aspect.review && ( // Show feedback if exists
                          <Text>
                            <Text strong>Feedback:</Text>
                            <Paragraph style={{ marginBottom: 0 }}>{aspect.review}</Paragraph>
                          </Text>
                        )}

                        <br />

                        {aspect.action_points.map((actionPoint, index) => (
                          <Text key={index}>
                            <Text strong>Action Point {index + 1}:</Text>
                            <Paragraph style={{ marginBottom: 0 }}>
                              {actionPoint.description}
                            </Paragraph>
                          </Text>
                        ))}
                      </div>
                    )
                  )}
                </Space>
              }
            />
          );
        })}
      </Steps>
    </>
  );
};

export default AspectsReviewPane;
