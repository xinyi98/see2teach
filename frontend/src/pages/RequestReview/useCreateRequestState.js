import { useReducer } from 'react';

const initialState = {
  id: -1,
  reviewer: {},
  reason: '',
  course: '',
  course_description: '',
  aspects: [
    {
      aspect_name: 'General',
      reviewee_comments: '',
    },
  ],
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'id': {
      const id = action.value;
      return {
        ...state,
        id,
      };
    }
    case 'reviewer': {
      const reviewer = action.value;
      return {
        ...state,
        reviewer,
      };
    }
    case 'reason': {
      const reason = action.value;
      return {
        ...state,
        reason,
      };
    }
    case 'course': {
      const course = action.value;
      return {
        ...state,
        course,
      };
    }
    case 'course_description': {
      const course_description = action.value;
      return {
        ...state,
        course_description,
      };
    }
    case 'selectedAspects': {
      const { selectedAspects } = action;

      const aspects = selectedAspects.map((aspect_name) => ({
        aspect_name,
        reviewee_comments: '',
      }));

      aspects.forEach((aspect_comment) => {
        state.aspects.forEach((x) => {
          if (x.aspect_name === aspect_comment.aspect_name) {
            aspect_comment.reviewee_comments = x.reviewee_comments;
          }
        });
      });

      return {
        ...state,
        aspects,
      };
    }
    case 'aspectComments': {
      const { aspect_name, reviewee_comments } = action;
      // find the updated aspect
      const index = state.aspects.findIndex((aspect) => aspect.aspect_name === aspect_name);
      return {
        ...state,
        aspects: state.aspects.map((aspect, i) =>
          i === index
            ? {
                ...aspect,
                reviewee_comments,
              }
            : aspect
        ),
      };
    }
    default:
      throw new Error(`Invalid action type: ${action.type}`);
  }
};

const useCreateRequestState = (prevState) => {
  const [state, dispatch] = useReducer(reducer, prevState ? prevState : initialState);

  return [state, dispatch];
};

export default useCreateRequestState;
