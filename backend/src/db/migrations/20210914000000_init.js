exports.up = function (knex) {
  return knex.schema
    .createTable('users', (table) => {
      table.integer('id').notNullable().primary();
      table.string('upi', 10).notNullable();
      table.string('name', 100).notNullable();
    })

    .createTable('aspects', (table) => {
      table.string('name', 32).notNullable().primary();
      table.text('description');
    })

    .createTable('peer_review', (table) => {
      table.increments('id').primary();
      table.integer('reviewee_id').notNullable();
      table.integer('reviewer_id').notNullable();
      table.text('reason');
      table.text('course');
      table.text('course_description');
      table.text('reflection');
      table.string('status');
      table.timestamp('last_updated').defaultTo(knex.fn.now());
      table.text('request_response');
      table.text('action_plan');

      table.foreign('reviewee_id').references('users.id');
      table.foreign('reviewer_id').references('users.id');
    })

    .createTable('peer_review_aspect', (table) => {
      table.integer('peer_review_id').notNullable();
      table.string('aspect_name', 32).notNullable();
      table.text('review');
      table.text('reviewee_comments');

      table.primary(['peer_review_id', 'aspect_name']);
      table.foreign('peer_review_id').references('peer_review.id').onDelete('CASCADE');
      table.foreign('aspect_name').references('aspects.name');
    })

    .createTable('action_points', (table) => {
      table.increments('id').primary();
      table.integer('peer_review_id').notNullable();
      table.string('aspect_name', 32).notNullable();
      table.string('name', 50);
      table.text('description');

      table.foreign('peer_review_id').references('peer_review.id').onDelete('CASCADE');
      table.foreign('aspect_name').references('aspects.name');
    })

    .createTable('guided_prompts', (table) => {
      table.string('name').primary();
      table.string('category');
    })

    .createTable('guided_prompt_answers', (table) => {
      table.increments('id').primary();
      table.integer('peer_review_id').notNullable();
      table.string('guided_prompts_name').notNullable();
      table.string('prompt_answer').notNullable();

      table.foreign('peer_review_id').references('peer_review.id').onDelete('CASCADE');
      table.foreign('guided_prompts_name').references('guided_prompts.name');
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTable('users')
    .dropTable('aspects')
    .dropTable('peer_review')
    .dropTable('peer_review_aspect')
    .dropTable('action_points')
    .dropTable('guided_prompts')
    .dropTable('guided_prompt_answers');
};
