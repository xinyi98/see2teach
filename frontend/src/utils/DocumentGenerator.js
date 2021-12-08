import { Document, HeadingLevel, Paragraph, TextRun } from 'docx';

export function DocumentCreator(details) {
  const aspects = details.aspects;
  const questionnaire = details.guidedPrompts;
  const actionPlan = details.action_plan;

  const doc = new Document({
    styles: {
      paragraphStyles: [
        {
          name: 'Normal',
          run: {
            size: 24, // measured in half points - 24 is 12 point font size
          },
        },
      ],
    },
    sections: [
      {
        children: [
          new Paragraph({
            text: 'Review Details',
            heading: HeadingLevel.TITLE,
          }),
          createLineBreak(),

          createHeading('General Information'),
          new Paragraph({
            children: [
              new TextRun({ text: 'Reviewee: ', bold: true }),
              new TextRun(details.reviewee.name),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Reviewer: ', bold: true }),
              new TextRun(details.reviewer.name),
            ],
          }),
          new Paragraph({
            children: [new TextRun({ text: 'Course: ', bold: true }), new TextRun(details.course)],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Course Description: ', bold: true }),
              new TextRun(details.course_description),
            ],
          }),
          createLineBreak(),

          questionnaire.length > 0 && createHeading('Questionnaire Answers'),
          ...questionnaire
            .map((question) => {
              const arr = [];

              arr.push(createBoldText(question.guided_prompts_name));
              arr.push(createText(question.prompt_answer));
              arr.push(createLineBreak());

              return arr;
            })
            .reduce((prev, curr) => prev.concat(curr), []),
          createLineBreak(),

          createHeading('Written Feedback'),
          ...aspects
            .map((aspect) => {
              const arr = [];

              arr.push(createSubHeading(aspect.aspect_name));

              arr.push(createBoldText('Reviewee comments'));
              aspect.reviewee_comments
                ? arr.push(createText(aspect.reviewee_comments))
                : arr.push(createItalicsText('N/A'));
              arr.push(createLineBreak());

              arr.push(createBoldText('Reviewer feedback'));
              aspect.review
                ? arr.push(createText(aspect.review))
                : arr.push(createItalicsText('N/A'));
              arr.push(createLineBreak());

              if (aspect.action_points.length > 0) {
                arr.push(createBoldText('Action Points'));
                aspect.action_points.forEach((ap, index) => {
                  arr.push(createItalicsText(`Action point ${index + 1}`));
                  arr.push(createText(ap.description));
                  arr.push(createLineBreak());
                });
              }

              return arr;
            })
            .reduce((prev, curr) => prev.concat(curr), []),

          createLineBreak(),
          actionPlan !== null && createHeading("Reviewee's Action Plan"),
          actionPlan !== null &&
            new Paragraph({
              children: [new TextRun(actionPlan)],
            }),
        ],
      },
    ],
  });
  return doc;
}

const createHeading = (text) => {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_1,
    thematicBreak: true,
  });
};

const createSubHeading = (text) => {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_2,
  });
};

const createBoldText = (text) => {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        bold: true,
      }),
    ],
  });
};

const createItalicsText = (text) => {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        italics: true,
      }),
    ],
  });
};

const createText = (text) => {
  return new Paragraph({
    children: [
      new TextRun({
        text,
      }),
    ],
  });
};

const createLineBreak = () => {
  return new Paragraph({
    children: [],
  });
};
