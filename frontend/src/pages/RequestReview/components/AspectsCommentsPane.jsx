import { Tabs, Input } from 'antd';

const { TabPane } = Tabs;
const { TextArea } = Input;

// show the details of selected aspects
const AspectsCommentsPane = ({ selectedAspects, dispatch }) => {
  const updateComment = (aspect_name, reviewee_comments) => {
    dispatch({ type: 'aspectComments', aspect_name, reviewee_comments });
  };

  return (
    <Tabs type="card" size="small" tabBarStyle={{ marginBottom: 0 }}>
      {selectedAspects.map((aspect, key) => (
        <TabPane tab={aspect.aspect_name} key={key}>
          <TextArea
            placeholder={`${aspect.aspect_name} comments...`}
            value={aspect.reviewee_comments}
            rows={6}
            onChange={(e) => updateComment(aspect.aspect_name, e.target.value)}
          />
        </TabPane>
      ))}
    </Tabs>
  );
};

export default AspectsCommentsPane;
