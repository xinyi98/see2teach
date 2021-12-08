import React from 'react';
import { Radio, Typography } from 'antd';
import { guidedPromptAnswers } from '../../../constants/enums';

const { Text } = Typography;

const LikertScale = ({ dispatch, promptName, defaultAnswer, isEditable }) => {
  const updatePrompts = (e) => {
    dispatch({
      type: 'setPromptAnswer',
      payload: { guided_prompts_name: promptName, prompt_answer: e.target.value },
    });
  };

  return (
    <div style={{ padding: '1rem 0 1rem 1rem', margin: '1rem 0 1rem 1rem' }}>
      <Text strong>{promptName}</Text>
      <br />
      <Radio.Group
        defaultValue={defaultAnswer && defaultAnswer}
        name="radiogroup"
        onChange={updatePrompts}
        style={{ marginTop: '.5rem' }}
        disabled={!isEditable}
      >
        {Object.values(guidedPromptAnswers).map((ans, i) => (
          <Radio key={i} value={ans} style={{ marginRight: '3rem' }}>
            {ans}
          </Radio>
        ))}
      </Radio.Group>
    </div>
  );
};

export default LikertScale;
