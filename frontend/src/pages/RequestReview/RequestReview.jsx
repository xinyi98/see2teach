import { useState } from 'react';
import { Steps, message } from 'antd';
import { useLocation } from 'react-router-dom';

import useCreateRequestState from './useCreateRequestState';
import CourseDetails from './components/CourseDetails';
import CommentsPage from './components/Comments';
import Summary from './components/Summary';
import { useAppContext } from '../../context/AppContextProvider';
import { createRequest, updateRequest } from '../../api/PeerReviewApi';
import CenteredColumn from '../../components/CenteredColumn';
import { peerReviewStatus } from '../../constants/enums';

const { Step } = Steps;

const RequestReview = () => {
  const location = useLocation();
  const { details } = location.state || {};
  const [state, dispatch] = useCreateRequestState(details);
  const [step, setStep] = useState(0);

  const { user } = useAppContext();

  const handleSaveDraft = () => {
    if (!state.reviewer.id) {
      message.error('Reviewer must be filled in');
      return;
    }
    if (state.id === -1) {
      // the reuqest is not existed in the database
      // create new request
      createRequest({ user, ...state, status: peerReviewStatus.DRAFT }).then((response) => {
        message.success('Request draft saved');
        const value = response.data.peer_review_id;
        dispatch({ type: 'id', value: value });
      });
    } else {
      // the reuqest is in the database
      // update the existing request
      updateRequest({ user, ...state, status: peerReviewStatus.Draft }).then(() => {
        message.success('Request draft saved');
      });
    }
  };

  return (
    <div>
      <h1>Create Peer Review Request</h1>
      <CenteredColumn>
        <div style={{ paddingTop: 50 }}>
          <Steps size="large" current={step}>
            <Step title="Course Details" />
            <Step title="Comments" />
            <Step title="Summary" />
          </Steps>
        </div>
        <div style={{ paddingTop: 50 }}>
          {step === 0 && (
            <CourseDetails
              details={state}
              dispatch={dispatch}
              handleSaveDraft={handleSaveDraft}
              setStep={setStep}
            />
          )}
          {step === 1 && (
            <CommentsPage
              aspects={state.aspects}
              dispatch={dispatch}
              handleSaveDraft={handleSaveDraft}
              setStep={setStep}
            />
          )}
          {step === 2 && (
            <Summary details={state} handleSaveDraft={handleSaveDraft} setStep={setStep} />
          )}
        </div>
      </CenteredColumn>
    </div>
  );
};

export default RequestReview;
