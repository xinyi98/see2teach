import React from 'react';
import { useState, useEffect } from 'react';
import { Table, Space, Button, Modal, message } from 'antd';
import { useAppContext } from '../../context/AppContextProvider';
import { getAllReviews, deleteRequest } from '../../api/PeerReviewApi';
import StatusTag from '../../components/StatusTag';
import { Link } from 'react-router-dom';
import { peerReviewStatus } from '../../constants/enums';
import StatusFilterComponent from '../../components/ReviewTable/StatusFilterComponent';
import dateFormat from 'dateformat';

const MyReviews = () => {
  const { user } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [getFlag, setGetFlag] = useState(false);

  const [searchedReview, setSearchedReview] = useState([]); // record reviews when the user changes search term
  const [filteredReview, setFilteredReview] = useState([]); // record reviews when the user changes status
  const [displayedReview, setDisplayedReview] = useState([]); // record the final displayed reviews

  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [detailId, setId] = useState('');

  // fetch all the peer reviews
  useEffect(() => {
    setLoading(true);
    getAllReviews(user.id, 'reviewee')
      .then((res) => {
        if (res.data) {
          setReviews(res.data); // data from get
          setSearchedReview(res.data); // searched val or all
          setFilteredReview(res.data); // filtered data
          setDisplayedReview(res.data); // displayed data
        }

        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        message.error('Failed to retrieve peer reviews. Please refresh the page to try again.', 5);
      });
    setGetFlag(false);
  }, [user, getFlag]);

  const handleDeleteOpen = (value) => {
    setId(value);
    setConfirmationVisible(true);
  };

  const handleConfirmationClose = () => {
    setConfirmationVisible(false);
  };

  const handleConfirmOK = () => {
    deleteRequest(detailId)
      .then(() => {
        message.success('SUCCESS', 3);
      })
      .catch(() => {
        message.error('Ooops..there is something wrong, please try it again later', 3);
      });
    setGetFlag(true);
    handleConfirmationClose();
  };

  const columns = [
    {
      title: 'Reviewer Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Course',
      dataIndex: 'course',
      key: 'course',
    },
    {
      title: 'Last updated',
      dataIndex: 'last_updated',
      key: 'last_updated',
      render: (time) => dateFormat(time, 'dd/mm/yyyy'),
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      render: (status) => (
        <Space size="middle">
          <StatusTag status={status} isReviewee={true} />
        </Space>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (record) => (
        <Space size="middle">
          {record.status === peerReviewStatus.DRAFT ? (
            [
              <Link
                to={{
                  pathname: `/review/${record.id}`,
                  state: {
                    isPending: record.status === peerReviewStatus.PENDING,
                  },
                }}
              >
                <Button type="link">View</Button>
              </Link>,
              <Button type="link" onClick={() => handleDeleteOpen(record.id)}>
                Delete
              </Button>,
            ]
          ) : (
            <Link
              to={{
                pathname: `/review/${record.id}`,
                state: {
                  isPending: record.status.toLowerCase() === peerReviewStatus.PENDING,
                },
              }}
            >
              <Button type="link">View</Button>
            </Link>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h1>My reviews</h1>
      <p style={{ color: '#c0c0c0' }}>Others’ observations of my courses.</p>

      <StatusFilterComponent
        searchedReview={searchedReview}
        setSearchedReview={setSearchedReview}
        filteredReview={filteredReview}
        setFilteredReview={setFilteredReview}
        setDisplayedReview={setDisplayedReview}
        reviews={reviews}
      />

      <Table
        rowKey="id"
        dataSource={displayedReview}
        columns={columns}
        loading={loading}
        locale={{ emptyText: 'No peer reviews' }}
        pagination={{
          defaultPageSize: 5,
          showSizeChanger: true,
          pageSizeOptions: ['5', '10', '20'],
        }}
      />

      <Modal
        visible={confirmationVisible}
        onOk={handleConfirmOK}
        onCancel={handleConfirmationClose}
      >
        <p>Are you sure you want to delete this peer review request draft?</p>
      </Modal>
    </div>
  );
};

export default MyReviews;
