import { Select, Form } from 'antd';
import { useEffect, useState } from 'react';
import { getAspects } from '../../../api/PeerReviewApi';

const { Option } = Select;

const AspectsDropdown = ({ selectedAspects, dispatch }) => {
  const [aspects, setAspects] = useState([]);

  useEffect(() => {
    getAspects()
      .then((res) => {
        setAspects(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const onChange = (value) => {
    dispatch({ type: 'selectedAspects', selectedAspects: value });
  };

  return (
    <Form layout="vertical">
      <Form.Item label="Teaching aspects">
        <Select
          data-testid="aspects-select"
          value={selectedAspects.map((aspects) => aspects.aspect_name)}
          mode="multiple"
          showSearch
          showArrow
          style={{ width: 300 }}
          placeholder="Select aspects"
          loading={aspects.length === 0}
          onChange={onChange}
          maxTagCount={0}
          maxTagPlaceholder={(tags) => `${tags.length - 1} aspect(s) selected`} // length -1 as we don't want to count "General"
        >
          {aspects?.map((aspect) => {
            return (
              <Option value={aspect.name} key={aspect.name} title={aspect.description}>
                {aspect.name}
              </Option>
            );
          })}
        </Select>
      </Form.Item>
    </Form>
  );
};

export default AspectsDropdown;
