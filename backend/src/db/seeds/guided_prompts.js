exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('guided_prompts')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('guided_prompts').insert([
        { name: 'The teacher focusses on factual material', category: 'Subject matter' },
        { name: 'The teacher emphasises conceptual understanding', category: 'Subject matter' },
        { name: 'Students’ prior knowledge is taken into account', category: 'Subject matter' },
        { name: 'The teacher caters for student diversity', category: 'Subject matter' },
        {
          name: 'Teaching takes the needs of minority groups into account',
          category: 'Subject matter',
        },
        {
          name: 'Teaching emphasises how the theory applies to practice',
          category: 'Subject matter',
        },
        { name: 'The teacher’s presentation style is effective', category: 'Style' },
        { name: 'The teacher is enthusiastic about the topic', category: 'Style' },
        { name: 'The teacher speaks clearly', category: 'Style' },
        { name: 'The teacher maintains student attention', category: 'Style' },
        { name: 'The teacher promotes student engagement', category: 'Style' },
        {
          name: 'The teacher defines the intended learning outcomes',
          category: 'Teaching approach',
        },
        {
          name: 'The teacher and students address the intended learning outcomes',
          category: 'Teaching approach',
        },
        {
          name: 'Learning materials are organised and presented logically',
          category: 'Teaching approach',
        },
        {
          name: 'The teacher gives students opportunities to interact with him/her, with the content and with their peers',
          category: 'Teaching approach',
        },
        { name: 'Students participate as active learners', category: 'Teaching approach' },
        {
          name: 'Teaching flows in one direction from the teacher to the students',
          category: 'Teaching approach',
        },
        {
          name: 'Teaching is interactive; there is an on-going dialogue between the teacher and the students',
          category: 'Teaching approach',
        },
        { name: 'The teacher is approachable', category: 'Teaching approach' },
        { name: 'The teacher encourages students to ask questions', category: 'Teaching approach' },
        { name: 'The teacher asks questions', category: 'Teaching approach' },
        { name: 'The Canvas course is well structured', category: 'Online elements' },
        {
          name: 'Learning resources and lecture materials are well organised on Canvas',
          category: 'Online elements',
        },
        {
          name: 'Instructions and expectations about assignments and assessment are clear',
          category: 'Online elements',
        },
        {
          name: 'Recorded lectures are available and of a good quality',
          category: 'Online elements',
        },
        {
          name: 'Resources that students need for assessments are accessible',
          category: 'Online elements',
        },
        {
          name: 'The teacher is present, available and approachable online',
          category: 'Online elements',
        },
      ]);
    });
};
