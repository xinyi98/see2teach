import { useState, useEffect } from 'react';
import { Table, Space, Button, message } from 'antd';
import { useAppContext } from '../../context/AppContextProvider';
import { getAllReviews } from '../../api/PeerReviewApi';
import StatusTag from '../../components/StatusTag';
import StatusFilterComponent from '../../components/ReviewTable/StatusFilterComponent';
import { Link } from 'react-router-dom';
import dateFormat from 'dateformat';

const RequestedReviews = () => {
  const { user } = useAppContext();

  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState([]);

  const [searchedReview, setSearchedReview] = useState([]); // record reviews when the user changes search term
  const [filteredReview, setFilteredReview] = useState([]); // record reviews when the user changes status
  const [displayedReview, setDisplayedReview] = useState([]); // record the final displayed reviews

  // fetch all the requested peer reviews
  useEffect(() => {
    setLoading(true);
    getAllReviews(user.id, 'reviewer')
      .then((res) => {
        if (res.data) {
          setRequests(res.data);
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
  }, [user]);

  const columns = [
    {
      title: 'Reviewee Name',
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
          <StatusTag status={status} isReviewee={false} />
        </Space>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (record) => (
        <Link to={`/review/${record.id}`}>
          <Button type="link">View</Button>
        </Link>
      ),
    },
  ];

  return (
    <div>
      <h1>Requested reviews</h1>
      <p style={{ color: '#c0c0c0' }}>My observations of others’ courses.</p>

      <StatusFilterComponent
        searchedReview={searchedReview}
        setSearchedReview={setSearchedReview}
        filteredReview={filteredReview}
        setFilteredReview={setFilteredReview}
        setDisplayedReview={setDisplayedReview}
        reviews={requests}
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
    </div>
  );
};

export default RequestedReviews;
