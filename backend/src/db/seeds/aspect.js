exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('aspects')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('aspects').insert([
        {
          name: 'Active learning',
          description:
            'Students are in charge of their learning process. They participate in meaningful learning activities. They partner with the teacher/tutor or with other students during the learning process. They contribute to or respond actively to the content, the teacher or the learning task.',
        },
        {
          name: 'Assessment',
          description:
            'Assessments are clearly linked to the learning outcomes. They are aligned with the learning activities and assignments. Student learning is assessed appropriately in relation to the intended learning outcomes.',
        },
        {
          name: 'Canvas course page',
          description:
            'The Canvas course is well structured. Students find the course easy to navigate and well organised. Information is easy to find and retrieve, and is consistently presented. There are sufficient course resources (not too many). Staff communication students via Canvas clear and the frequency is appropriate.',
        },
        {
          name: 'Content',
          description:
            'The volume, level of difficulty, and relevance of the course content. Teaching focusses on students’ conceptual understanding of topics. The volume, breadth and depth of the learning material is appropriate for this level. The level of difficulty of explanations, questions or learning tasks is appropriate. Relevance of topics is emphasised.',
        },
        {
          name: 'Feedback on learning',
          description:
            'The teacher provides effective and timely feedback to students in class, and on their assessments.',
        },
        {
          name: 'General',
          description: 'General comments or anything else that is not part of the listed aspects.',
        },
        {
          name: 'Interactivity',
          description:
            'The teacher and students interact during the learning process, verbally, in writing, or by answering questions or carrying out learning tasks. There is a two-way process of dialogue, e.g. prompts to and responses by students. The interaction influences the learning process (e.g. by changing the pace, direction or topic)',
        },
        {
          name: 'Labs',
          description:
            'Lab activities engage all students, are interesting and promote learning. The lab activities are completed on time. Instructions are clear and reference materials are helpful and accessible. The link between the lab and the lectures is clear to students.',
        },
        {
          name: 'Pace',
          description:
            'The rate of the learning process is appropriate for the content and the learners.',
        },
        {
          name: 'Presentation quality',
          description:
            'The teacher is clearly audible, confident and professional. Slides, videos and other teaching aids are of a high quality. The teacher makes good eye contact (f2f) and includes the whole class during discussions or questions. The teacher synchronises their verbal and visual messages clearly during their teaching. The pace of the presentation is appropriate for student learning and motivation.',
        },
        {
          name: 'Student engagement',
          description:
            'Students engage with the course material, the teacher and with one another in ways that are appropriate to achieve the intended learning outcomes. For example, class attendance is good, course assessments are completed on time, students are on time for labs and tutorials, course work is completed on time, students answer questions and participate in discussions. Students engage with optional learning tasks that are not assessed.',
        },
        {
          name: 'Student questions',
          description:
            'Students’ questions are encouraged and answered clearly in a timely way using appropriate channels (e.g.  FAQs online, questions in class, office hours). The teacher incorporates students’ questions in their teaching.',
        },
        {
          name: 'Student understanding',
          description:
            'The teacher monitors student understanding using appropriate questions/checks, and is responsive to these checks (e.g. with questions in class, quizzes, polls, or learning tasks). Teaching prompts students to check their own understanding of instructions, assessments, and the course concepts.',
        },
        {
          name: 'Teacher questions',
          description:
            'The teacher asks good questions at appropriate times which help students review their understanding or decide what to do next. The teacher makes good use of the students’ answers to adapt their teaching where necessary.',
        },
        {
          name: 'Teaching presence',
          description:
            'Face-to-face / online teaching presence. The teacher is motivating, accessible and approachable. Instructions and expectations are clear and timely. There is appropriate support for students about learning goals, tasks and assessments (e.g. resources, reference materials, instructions, templates, rubrics, worksheets, FAQs, discussion forums, office hours, answers to students’ questions).',
        },
        {
          name: 'Tutorials',
          description:
            'Learning activities engage all students and promote learning. Teaching provides the support, feedback, and guidance that students need.',
        },
      ]);
    });
};
