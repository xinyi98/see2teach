import AspectsCommentsPane from './AspectsCommentsPane';
import AspectsDropdownList from './AspectsDropdown';
import { Button } from 'antd';

// users can select peer review aspects on the page
const CommentsPage = ({ aspects, dispatch, handleSaveDraft, setStep }) => {
  return (
    <>
      <p style={{ color: 'red' }}>
        Please select the aspects that you want to be reviewed in the dropdown list and leave your
        comments to the reviewer.
      </p>
      <AspectsDropdownList selectedAspects={aspects} dispatch={dispatch} />
      <AspectsCommentsPane selectedAspects={aspects} dispatch={dispatch} />

      <div style={{ paddingTop: 64 }}>
        <Button type="seconday" onClick={() => handleSaveDraft()}>
          Save Draft
        </Button>
        <Button
          type="primary"
          style={{ marginLeft: 10, float: 'right' }}
          onClick={() => setStep(2)}
        >
          Next
        </Button>
        <Button style={{ float: 'right' }} onClick={() => setStep(0)}>
          Previous
        </Button>
      </div>
    </>
  );
};

export default CommentsPage;
