import {
  Button,
  PageHeader,
  Skeleton,
  Space,
  Drawer,
  Input,
  message,
  Modal,
  Row,
  Col,
  Result,
} from 'antd';
import { FormOutlined, ExportOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getReview, updateReview } from '../../api/PeerReviewApi';
import StatusTag from '../../components/StatusTag';
import { useAppContext } from '../../context/AppContextProvider';
import { Packer } from 'docx';
import { saveAs } from 'file-saver';
import { DocumentCreator } from '../../utils/DocumentGenerator';
import ReviewForm from './components/ReviewForm';
import ReviewDetails from './components/ReviewDetails';
import CenteredColumn from '../../components/CenteredColumn';
import { peerReviewStatus } from '../../constants/enums';
import AspectAffix from './components/AspectAffix';
import { useTabletAndBelowMediaQuery } from '../../utils/media-breakpoints';
import './Review.css';
import dateFormat from 'dateformat';

const { TextArea } = Input;

const Review = () => {
  const { id } = useParams();
  const { user } = useAppContext();

  const [details, setDetails] = useState(null);
  const [unauthorised, setUnauthorised] = useState(false);

  const [showActionPlanDrawer, setShowActionPlanDrawer] = useState(false);
  const [showReflectionDrawer, setShowReflectionDrawer] = useState(false);

  // Accept/decline modal state
  const [responsePrompt, setResponsePrompt] = useState('');
  const [responsePromptPlaceholder, setResponsePromptPlaceholder] = useState('');
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [nextStatus, setNextStatus] = useState('');

  const isReviewer = details?.reviewer.id.toString() === user.id.toString();
  const isTabletAndBelow = useTabletAndBelowMediaQuery();

  useEffect(() => {
    getReview(id, user.id)
      .then((res) => {
        setDetails(res.data);
      })
      .catch((err) => {
        if (err.response?.status === 403) {
          setUnauthorised(true);
        } else {
          message.error('Failed to retrieve peer review. Please refresh the page to try again.', 5);
        }
      });
  }, [id, user.id]);

  const handleAcceptConfirmationOpen = () => {
    setNextStatus(peerReviewStatus.AWAITING_PEER_REVIEW);
    setResponsePrompt('Do you want to accept this peer review request?');
    setResponsePromptPlaceholder('Provide a message for the reviewee');
    setConfirmationVisible(true);
  };

  const handleRejectConfirmationOpen = () => {
    setNextStatus(peerReviewStatus.DECLINED);
    setResponsePrompt('Do you want to reject this peer review request?');
    setResponsePromptPlaceholder('Provide a reason for rejecting the peer review');
    setConfirmationVisible(true);
  };

  const handleConfirmOK = () => {
    const responseMessage = document.getElementById('responseMessage').value;

    updateReview(id, { status: nextStatus, request_response: responseMessage })
      .then(() => {
        setDetails({
          ...details,
          status: nextStatus,
          request_response: responseMessage,
        });
        message.success('SUCCESS', 3);
      })
      .catch(() => {
        message.error('Ooops.. there is something wrong, please try again later', 3);
      });
    setConfirmationVisible(false);
  };

  const handleSaveReflection = () => {
    updateReview(id, { reflection: details.reflection })
      .then(() => {
        message.success('Saved', 3);
        setShowReflectionDrawer(false);
      })
      .catch(() => {
        message.error('Ooops.. there is something wrong, please try again', 3);
      });
  };

  const handleSubmitActionPlan = () => {
    updateReview(id, { action_plan: details.action_plan, status: peerReviewStatus.COMPLETE }).then(
      () => {
        setDetails({
          ...details,
          status: peerReviewStatus.COMPLETE,
        });
        setShowActionPlanDrawer(false);
        message.success('Sucessfully submitted action plan');
      }
    );
  };

  const exportReview = () => {
    const doc = new DocumentCreator(details);

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, 'PeerReview.docx');
    });
  };

  const ActionButtons = () => (
    <Space size="middle">
      {isReviewer &&
        details?.status === peerReviewStatus.PENDING && [
          <Button key={0} type="primary" onClick={() => handleAcceptConfirmationOpen()}>
            Accept
          </Button>,
          <Button key={1} type="secondary" onClick={() => handleRejectConfirmationOpen()}>
            Decline
          </Button>,
        ]}

      {!isReviewer && details && details.status === peerReviewStatus.COMPLETE && (
        <Button onClick={() => setShowReflectionDrawer(true)} icon={<FormOutlined />}>
          Self Reflection
        </Button>
      )}

      {!isReviewer && details?.status === peerReviewStatus.DRAFT && (
        <Link
          to={{
            pathname: `/request-review`,
            state: { details },
          }}
        >
          <Button type="primary">Edit Request</Button>
        </Link>
      )}

      {!isReviewer && details?.status === peerReviewStatus.AWAITING_ACTION_PLAN && (
        <Button onClick={() => setShowActionPlanDrawer(true)}>Submit Action Plan</Button>
      )}

      {details?.status === peerReviewStatus.COMPLETE && (
        <Button type="primary" icon={<ExportOutlined />} onClick={exportReview}>
          Export
        </Button>
      )}
    </Space>
  );

  return (
    <>
      <PageHeader
        className="review-page-header"
        title="Peer Review"
        subTitle={
          details?.last_updated && `Last updated: ${dateFormat(details.last_updated, 'dd/mm/yyyy')}`
        }
        tags={details?.status && <StatusTag status={details.status} isReviewee={!isReviewer} />}
        extra={<ActionButtons />}
        style={{ padding: 0 }}
      >
        {unauthorised ? (
          <Result
            status="403"
            title="Unauthorised"
            subTitle="Sorry, you are not authorised to view this peer review."
          />
        ) : (
          <CenteredColumn style={{ marginTop: 32 }}>
            <Row>
              <Col xs={24} sm={24} md={20} lg={20} xl={20} xxl={20}>
                <Skeleton active loading={details === null}>
                  <div style={{ marginBottom: 32 }}>
                    <ReviewDetails details={details} />
                  </div>
                  <ReviewForm details={details} isReviewer={isReviewer} />
                </Skeleton>
              </Col>
              <Col xs={0} sm={0} md={4} lg={4} xl={4} xxl={4}>
                <AspectAffix aspects={details?.aspects} />
              </Col>
            </Row>
          </CenteredColumn>
        )}
      </PageHeader>

      <Modal
        visible={confirmationVisible}
        onOk={handleConfirmOK}
        onCancel={() => setConfirmationVisible(false)}
      >
        <p>{responsePrompt}</p>
        <TextArea id="responseMessage" rows={3} placeholder={responsePromptPlaceholder} />
      </Modal>

      <Drawer
        title="Self Reflection"
        width={isTabletAndBelow ? '100%' : window.innerWidth * 0.2 < 250 ? 250 : '20%'}
        placement="right"
        onClose={() => setShowReflectionDrawer(false)}
        visible={showReflectionDrawer}
        maskClosable={false}
        keyboard={false}
        mask={false}
      >
        <TextArea
          value={details?.reflection}
          onChange={(e) => setDetails({ ...details, reflection: e.target.value })}
          style={{ height: '80%' }}
        />
        <div
          style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e9e9e9',
            padding: '10px 16px',
            background: '#fff',
            textAlign: 'right',
          }}
        >
          <Button type="primary" style={{ width: 80 }} onClick={handleSaveReflection}>
            Save
          </Button>
        </div>
      </Drawer>

      <Drawer
        title="Action Plan"
        width={isTabletAndBelow ? '100%' : window.innerWidth * 0.25 < 250 ? 250 : '25%'}
        placement="right"
        onClose={() => setShowActionPlanDrawer(false)}
        visible={showActionPlanDrawer}
        maskClosable={false}
        keyboard={false}
        mask={false}
      >
        <TextArea
          value={details?.action_plan}
          onChange={(e) => setDetails({ ...details, action_plan: e.target.value })}
          style={{ height: '80%' }}
        />
        <div
          style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e9e9e9',
            padding: '10px 16px',
            background: '#fff',
            textAlign: 'right',
          }}
        >
          <Button
            type="primary"
            onClick={() =>
              Modal.confirm({
                title: 'Submit Action Plan',
                icon: <ExclamationCircleOutlined />,
                content: (
                  <>
                    <p>
                      Submitting the action plan will complete the peer review and no further
                      changes can be made.
                    </p>
                    <p>Do you wish to submit?</p>
                  </>
                ),
                onOk: () => handleSubmitActionPlan(),
              })
            }
          >
            Submit Action Plan
          </Button>
        </div>
      </Drawer>
    </>
  );
};

export default Review;
