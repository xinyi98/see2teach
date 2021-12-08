// enum for searching reviews in myreivews and requested reviews
export const SEARCHBY = {
  NAME: 'name',
  COURSE: 'course',
};
// guided feedback prompts answers
export const guidedPromptAnswers = {
  STRONGLYAGREE: 'Strongly Agree',
  AGREE: 'Agree',
  NEUTRAL: 'Neutral',
  DISAGREE: 'Disagree',
  STRONGLYDISAGREE: 'Strongly Disagree',
};
// guided feedback prompt catagories
export const guidedPromptCategories = {
  SUBJECT_MATTER: 'Subject matter',
  STYLE: 'Style',
  TEACHING_APPROACH: 'Teaching approach',
  ONLINE_ELEMENTS: 'Online elements',
};

// peer review status
export const peerReviewStatus = {
  PENDING: 'pending',
  COMPLETE: 'complete',
  DECLINED: 'declined',
  DRAFT: 'draft',
  REVIEW_DRAFT: 'review_draft',
  AWAITING_PEER_REVIEW: 'awaiting_peer_review',
  AWAITING_ACTION_PLAN: 'awaiting_action_plan',
};
