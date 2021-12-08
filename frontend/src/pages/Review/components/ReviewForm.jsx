import { Button, Modal, message, Divider } from 'antd';
import { createReview } from '../../../api/PeerReviewApi';
import AspectsReviewPane from './AspectsReviewPane';
import useFeedbackFormState from '../useReviewFormState';
import { useState } from 'react';
import GuidedFeedback from './GuidedFeedback';
import { peerReviewStatus } from '../../../constants/enums';

const ReviewForm = ({ details, isReviewer }) => {
  const [state, dispatch] = useFeedbackFormState({
    aspects: details.aspects,
    guidedPrompts: details.guidedPrompts,
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [feedbackModalText, setFeedbackModalText] = useState([]);
  const [actionPointModalText, setActionPointModalText] = useState([]);

  const isEditable =
    isReviewer &&
    (details.status === peerReviewStatus.AWAITING_PEER_REVIEW ||
      details.status === peerReviewStatus.REVIEW_DRAFT);
  const showReview =
    details.status !== peerReviewStatus.DRAFT &&
    details.status !== peerReviewStatus.PENDING &&
    details.status !== peerReviewStatus.DECLINED;

  const checkOnSubmit = () => {
    const emptyReviews = [];
    const emptyActionPoints = [];
    state.aspects.forEach((aspect) => {
      if (!aspect.review) {
        emptyReviews.push(aspect.aspect_name);
      }
      let actionPoints = aspect.action_points;
      for (const ap of actionPoints) {
        if (ap.description === '') {
          emptyActionPoints.push(aspect.aspect_name);
        }
      }
    });
    setFeedbackModalText(emptyReviews);
    setActionPointModalText(emptyActionPoints);
    setModalVisible(true);
  };

  const handleOnSubmit = (status) => {
    const data = {
      peer_review_id: details.id,
      aspects: state.aspects,
      status: status,
      prompts: state.guidedPrompts,
    };
    createReview(data);
    if (status === peerReviewStatus.AWAITING_ACTION_PLAN) {
      window.location.reload();
    } else {
      message.success('Draft saved');
    }
  };

  return (
    <div>
      {showReview && (
        <>
          <h2 style={{ marginBottom: 0 }}>Questionnaire</h2>
          {isEditable && <header>Please respond to the following statements if applicable</header>}
          <GuidedFeedback details={details} dispatch={dispatch} isEditable={isEditable} />
          <Divider />
        </>
      )}

      <h2 style={{ marginBottom: 0 }}>Written Feedback</h2>
      {isEditable && (
        <header>
          Provide feedback and suggest action points to the reviewer based on the provided teaching
          aspects
        </header>
      )}
      <br />
      <AspectsReviewPane
        aspects={state.aspects}
        dispatch={dispatch}
        isEditable={isEditable}
        showReview={showReview}
      />

      {details.status === peerReviewStatus.COMPLETE && details.action_plan !== null && (
        <div>
          <Divider />
          <h2 style={{ marginBottom: 0 }}>Reviewee's Action Plan</h2>
          <p>{details.action_plan}</p>
        </div>
      )}

      {isEditable && (
        <div>
          <Button type="primary" onClick={checkOnSubmit} style={{ float: 'right', margin: '5px' }}>
            Submit
          </Button>
          <Button
            type="secondary"
            onClick={() => handleOnSubmit(peerReviewStatus.REVIEW_DRAFT)}
            style={{ float: 'right', margin: '5px' }}
          >
            Save
          </Button>
        </div>
      )}

      <Modal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => handleOnSubmit(peerReviewStatus.AWAITING_ACTION_PLAN)}
        okButtonProps={{ disabled: actionPointModalText.length !== 0 }}
      >
        <p>
          <strong>
            Are you sure you want to submit? You will not be able to edit this peer review after
            submitting.
          </strong>
        </p>
        {feedbackModalText.length !== 0 && (
          <>
            <p>Aspects you have not reviewed:</p>
            <ul>
              {feedbackModalText.map((aspect, key) => {
                return <li key={key}>{aspect}</li>;
              })}
            </ul>
          </>
        )}
        {actionPointModalText.length !== 0 && (
          <>
            <br />
            <p>There are empty action points. Please fill them out or delete them.</p>
            <p>Aspects with empty action points:</p>
            <ul>
              {actionPointModalText.map((aspect, key) => {
                return <li key={key}>{aspect}</li>;
              })}
            </ul>
          </>
        )}
      </Modal>
    </div>
  );
};

export default ReviewForm;
