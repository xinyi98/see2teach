exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('users')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        { id: 123456789, upi: 'abcd123', name: 'John Doe' },
        { id: 987654321, upi: 'wxyz123', name: 'Jane Doe' },
        { id: 555555555, upi: 'qwer123', name: 'Test User' },
      ]);
    });
};
