import Enzyme, { shallow } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import '../../../setupTests';

import RequestSummaryDetails from '../components/RequestSummaryDetails';

Enzyme.configure({ adapter: new Adapter() });

describe('shallow RequestSummaryDetails rendering tests', () => {
  const data = {
    reviewer: {
      id: 123456789,
      name: 'Test Reviewer',
      upi: 'abc123',
    },
    reason: 'test reason',
    course: 'test course',
    course_description: 'course description 123',
    aspects: [
      {
        aspect_name: 'aspect 1',
        reviewee_comments: 'comment 1',
      },
    ],
  };

  it('renders Description component and its children', () => {
    const wrapper = shallow(<RequestSummaryDetails details={data} />);

    expect(wrapper.find('Descriptions').length).toBe(1);
    expect(wrapper.find('Descriptions').children().length).toBe(5);
  });

  it('renders with the correct details', () => {
    const wrapper = shallow(<RequestSummaryDetails details={data} />);

    const descriptionItems = wrapper.find('Descriptions').children();

    expect(
      descriptionItems
        .findWhere((item) => item.prop('label') == 'Reviewer')
        .children()
        .text()
    ).toBe(data.reviewer.name);

    expect(
      descriptionItems
        .findWhere((item) => item.prop('label') == 'Reason for request')
        .children()
        .text()
    ).toBe(data.reason);

    expect(
      descriptionItems
        .findWhere((item) => item.prop('label') == 'Course')
        .children()
        .text()
    ).toBe(data.course);

    expect(
      descriptionItems
        .findWhere((item) => item.prop('label') == 'Course Description')
        .children()
        .text()
    ).toBe(data.course_description);

    expect(
      descriptionItems
        .findWhere((item) => item.prop('label') == 'Comments')
        .children()
        .children().length
    ).toBe(2);
  });
});
