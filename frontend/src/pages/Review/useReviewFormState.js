import { useReducer } from 'react';

const initialState = {
  aspects: [],
  guidedPrompts: [],
  reflection: '',
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'setReview': {
      const { aspect_name, review } = action;
      const index = state.aspects.findIndex((aspect) => aspect.aspect_name === aspect_name);

      return {
        ...state,
        aspects: state.aspects.map((aspect, i) =>
          i === index
            ? {
                ...aspect,
                review,
              }
            : aspect
        ),
      };
    }

    case 'addActionPoint': {
      const { aspectName } = action;

      return {
        ...state,
        aspects: state.aspects.map((aspect) =>
          aspect.aspect_name === aspectName
            ? { ...aspect, action_points: [...aspect.action_points, { description: '' }] }
            : aspect
        ),
      };
    }

    case 'deleteActionPoint': {
      const { aspectName, index } = action;

      return {
        ...state,
        aspects: state.aspects.map((aspect) =>
          aspect.aspect_name === aspectName
            ? {
                ...aspect,
                action_points: aspect.action_points.filter((ap, idx) => idx !== index),
              }
            : aspect
        ),
      };
    }

    case 'setActionPoint': {
      const { aspectName, index, description } = action;

      return {
        ...state,
        aspects: state.aspects.map((aspect) => {
          return aspect.aspect_name === aspectName
            ? {
                ...aspect,
                action_points: aspect.action_points.map((ap, idx) =>
                  idx === index ? { ...ap, description } : ap
                ),
              }
            : aspect;
        }),
      };
    }

    case 'setPromptAnswer': {
      const { guided_prompts_name, prompt_answer } = action.payload;
      const index = state.guidedPrompts.findIndex(
        (prompt) => prompt.guided_prompts_name === guided_prompts_name
      );
      // depends on if name is already present in prompts!!
      if (index === -1) {
        return {
          ...state,
          guidedPrompts: [...state.guidedPrompts, { guided_prompts_name, prompt_answer }],
        };
      }
      return {
        ...state,
        guidedPrompts: state.guidedPrompts.map((prompt, i) =>
          i === index ? { ...prompt, prompt_answer } : prompt
        ),
      };
    }

    default:
      throw new Error(`Invalid action type: ${action.type}`);
  }
};

const useReviewFormState = (prevState) => {
  const [state, dispatch] = useReducer(reducer, prevState ? prevState : initialState);

  return [state, dispatch];
};

export default useReviewFormState;
