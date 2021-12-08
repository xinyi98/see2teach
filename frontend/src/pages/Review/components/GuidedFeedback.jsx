import React, { useEffect, useState } from 'react';
import { getGuidedPrompts } from '../../../api/PeerReviewApi';
import { Collapse } from 'antd';
import { guidedPromptCategories } from '../../../constants/enums';
import LikertScale from './LikertScale';

const { Panel } = Collapse;

const GuidedFeedback = ({ details, dispatch, isEditable }) => {
  const [prompts, setPrompts] = useState([]); // stores all prompts avaiable to the user

  useEffect(() => {
    getGuidedPrompts()
      .then((res) => {
        setPrompts(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div>
      <Collapse bordered={false} style={{ background: 'rgb(253,253,253)' }}>
        {Object.values(guidedPromptCategories).map((category, i) => (
          <Panel header={category} key={i} style={{ padding: 0, border: 0 }}>
            {prompts
              .filter((prompt) => prompt.category === category)
              .map((p, key) => {
                const defaultAnswer = details.guidedPrompts.find(
                  (dataPrompt) => dataPrompt?.guided_prompts_name === p.name
                )?.prompt_answer;
                return (
                  <LikertScale
                    dispatch={dispatch}
                    promptName={p.name}
                    key={key}
                    defaultAnswer={defaultAnswer}
                    isEditable={isEditable}
                  />
                );
              })}
          </Panel>
        ))}
      </Collapse>
    </div>
  );
};

export default GuidedFeedback;
