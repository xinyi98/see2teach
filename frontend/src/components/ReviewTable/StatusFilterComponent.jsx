import React, { useState } from 'react';
import { Input, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import { SEARCHBY, peerReviewStatus } from '../../constants/enums';

const { Option } = Select;

const StatusFilterComponent = (props) => {
  const [searchTerm, setSearchTerm] = useState('');
  const {
    searchedReview,
    setSearchedReview,
    filteredReview,
    setFilteredReview,
    setDisplayedReview,
    reviews,
    isMyReviews,
  } = props;

  const [searchBy, setSearchBy] = useState(SEARCHBY.NAME);
  const [filerStatus, setFilterStatus] = useState(undefined);

  const handleFilterStatusChange = (value) => {
    setFilterStatus(value);
    if (value !== undefined) {
      if (searchTerm === '') {
        // use the original reviews
        setFilteredReview(reviews.filter((rev) => rev.status === value));
        setDisplayedReview(reviews.filter((rev) => rev.status === value));
      } else {
        // use the searched reviews
        setFilteredReview(searchedReview.filter((rev) => rev.status === value));
        setDisplayedReview(searchedReview.filter((rev) => rev.status === value));
      }
    } else {
      if (searchTerm === '') {
        // display the original reviews
        setFilteredReview(reviews);
        setDisplayedReview(reviews);
      } else {
        // display the searched reviews
        setFilteredReview(searchedReview);
        setDisplayedReview(searchedReview);
      }
    }
  };

  // searches review based on the name of user
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    if (searchBy === SEARCHBY.NAME) {
      if (filerStatus !== undefined) {
        if (val === '') {
          // filter the original reviews by status
          setSearchedReview(reviews.filter((rev) => rev.status === filerStatus));
          setDisplayedReview(reviews.filter((rev) => rev.status === filerStatus));
        } else {
          setSearchedReview(
            filteredReview.filter((rev) => rev.name.toLowerCase().includes(val.toLowerCase()))
          );
          setDisplayedReview(
            filteredReview.filter((rev) => rev.name.toLowerCase().includes(val.toLowerCase()))
          );
        }
      } else {
        // accept all status
        setSearchedReview(
          reviews.filter((rev) => rev.name.toLowerCase().includes(val.toLowerCase()))
        );
        setDisplayedReview(
          reviews.filter((rev) => rev.name.toLowerCase().includes(val.toLowerCase()))
        );
      }
    } else {
      if (filerStatus !== undefined) {
        if (val === '') {
          // filter the original reviews
          setSearchedReview(reviews.filter((rev) => rev.status === filerStatus));
          setDisplayedReview(reviews.filter((rev) => rev.status === filerStatus));
        } else {
          setSearchedReview(
            filteredReview.filter((rev) => rev.course.toLowerCase().includes(val.toLowerCase()))
          );
          setDisplayedReview(
            filteredReview.filter((rev) => rev.course.toLowerCase().includes(val.toLowerCase()))
          );
        }
      } else {
        // accept all status
        setSearchedReview(
          reviews.filter((rev) => rev.course.toLowerCase().includes(val.toLowerCase()))
        );
        setDisplayedReview(
          reviews.filter((rev) => rev.course.toLowerCase().includes(val.toLowerCase()))
        );
      }
    }
  };

  return (
    <div>
      <Input
        placeholder={`Search by ${searchBy}`}
        style={{ width: 260, marginBottom: '1rem' }}
        onChange={handleSearchChange}
        value={searchTerm}
        prefix={<SearchOutlined />}
      />

      <Select
        placeholder="Search by ... "
        style={{ width: 120, marginLeft: '2px' }}
        onChange={(value) => setSearchBy(value)}
        defaultValue={SEARCHBY.NAME}
      >
        <Option value={SEARCHBY.NAME}>Name</Option>
        <Option value={SEARCHBY.COURSE}>Course</Option>
      </Select>

      <Select
        placeholder="Filter by status "
        style={{ width: 180, marginLeft: '2px' }}
        onChange={(value) => {
          handleFilterStatusChange(value);
        }}
        allowClear={true}
        data-testid="filter-status-select"
      >
        <Option value={peerReviewStatus.PENDING}>Pending</Option>
        <Option value={peerReviewStatus.COMPLETE}>Complete</Option>
        <Option value={peerReviewStatus.DECLINED}>Declined</Option>
        {isMyReviews ? (
          <Option value={peerReviewStatus.DRAFT}>Draft</Option>
        ) : (
          <Option value={peerReviewStatus.REVIEW_DRAFT}>Review Draft</Option>
        )}

        <Option value={peerReviewStatus.AWAITING_PEER_REVIEW}>Awaiting Peer Review</Option>
        <Option value={peerReviewStatus.AWAITING_ACTION_PLAN}>Awaiting Action Plan</Option>
      </Select>
    </div>
  );
};

export default StatusFilterComponent;
