import { Button, Space, message } from 'antd';
import RequestSummaryDetails from './RequestSummaryDetails';
import { useState } from 'react';
import { createRequest, updateRequest } from '../../../api/PeerReviewApi';
import { useAppContext } from '../../../context/AppContextProvider';
import { useHistory } from 'react-router-dom';
import { peerReviewStatus } from '../../../constants/enums';

// display the summary of a peer review
const Summary = ({ details, handleSaveDraft, setStep }) => {
  const { user } = useAppContext();
  const history = useHistory();

  const [submitLoading, setSubmitLoading] = useState(false);

  const handleSubmit = () => {
    setSubmitLoading(true);
    if (details.id === -1) {
      // the request is not existed in the database
      // create new request
      createRequest({ user, ...details, status: peerReviewStatus.PENDING }).then(
        () => {
          history.push('/my-reviews');
          message.success('Sucessfully requested peer review', 3);
        },
        (err) => {
          message.success('Failed to submit peer review, please try again.', 3);
          setSubmitLoading(false);
        }
      );
    } else {
      // the request is in the database
      // update the existing request
      updateRequest({ user, ...details, status: peerReviewStatus.PENDING })
        .then(() => {
          history.push('/my-reviews');
          message.success('Sucessfully requested peer review', 3);
        })
        .catch((err) => {
          message.success('Failed to submit peer review, please try again.', 3);
          setSubmitLoading(false);
        });
    }
  };

  return (
    <div>
      <RequestSummaryDetails details={details} />
      <div style={{ paddingTop: 64 }}>
        <Button type="seconday" onClick={() => handleSaveDraft()}>
          Save Draft
        </Button>
        <div style={{ float: 'right' }}>
          <Space>
            <Button onClick={() => setStep(1)}>Previous</Button>
            <Button
              type="primary"
              loading={submitLoading}
              style={{ paddingLeft: 10 }}
              onClick={() => handleSubmit()}
            >
              Submit
            </Button>
          </Space>
        </div>
      </div>
    </div>
  );
};

export default Summary;
