'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('users', [
      {
        firstname: 'John',
        lastname: 'Doe',
        email: 'john.doe@example.com',
        password:
          '$2a$12$zU6Ma9Be2VWZeBo2CJOZcuHWsLy3jWngBI/DXuOZbNDoR2OHXzhJW', //password
        roleId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return await queryInterface.bulkDelete('users', null, {});
  },
};
