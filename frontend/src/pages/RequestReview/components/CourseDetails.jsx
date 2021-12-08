import { useEffect, useState } from 'react';
import { Form, Input, Select, Button } from 'antd';
import { useAppContext } from '../../../context/AppContextProvider';
import { getUsers } from '../../../api/PeerReviewApi';

const { TextArea } = Input;
const { Option } = Select;

const CourseDetails = ({ details, dispatch, handleSaveDraft, setStep }) => {
  // store all users retrieved from the database
  const [users, setUsers] = useState([]);
  const { user } = useAppContext();
  const [form] = Form.useForm();

  useEffect(() => {
    getUsers()
      .then((res) => {
        setUsers(
          res.data.filter((el) => {
            return el.id.toString() !== user.id.toString();
          })
        );
      })
      .catch((err) => console.log(err));
  }, [user]);

  const handleNext = async () => {
    try {
      await form.validateFields();
      setStep(1);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <Form
        form={form}
        layout="vertical"
        onValuesChange={(changed) => {
          const field = Object.keys(changed)[0];
          dispatch({
            type: field,
            // store user object if field is reviewer
            value:
              field === 'reviewer' ? users.find((u) => u.id === changed[field]) : changed[field],
          });
        }}
        initialValues={{
          reviewer: details.reviewer.name
            ? details.reviewer.name + ' - ' + details.reviewer.upi
            : '',
          reason: details.reason,
          course: details.course,
          course_description: details.course_description,
        }}
      >
        <Form.Item
          name="reviewer"
          label="Reviewer"
          rules={[
            {
              required: true,
              message: 'Please select a reviewer',
            },
          ]}
        >
          <Select
            style={{ maxWidth: '300px' }}
            placeholder="Select Reviewer..."
            data-testid="review-select"
          >
            {users.map((user) => (
              <Option value={user.id} key={user.id}>
                {user.name + ' - ' + user.upi}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="reason"
          label="Reason for requesting peer review"
          rules={[
            {
              required: true,
              message: "'Reason for requesting peer review' is required",
            },
          ]}
        >
          <TextArea rows={2} placeholder="Enter reason for review..." />
        </Form.Item>

        <Form.Item
          name="course"
          label="Course"
          rules={[
            {
              required: true,
              message: "'Course' is required",
            },
          ]}
        >
          <Input style={{ maxWidth: '300px' }} placeholder="Course name..." />
        </Form.Item>

        <Form.Item
          name="course_description"
          label="Course Description"
          rules={[
            {
              required: true,
              message: "'Course Description' is required",
            },
          ]}
        >
          <TextArea rows={4} placeholder="Enter a short course description..." />
        </Form.Item>
      </Form>
      <div style={{ paddingTop: 64 }}>
        <Button type="seconday" onClick={() => handleSaveDraft()}>
          Save Draft
        </Button>
        <Button type="primary" style={{ float: 'right' }} onClick={() => handleNext()}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default CourseDetails;
