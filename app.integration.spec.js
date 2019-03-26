const request = require('supertest');
const dataInterface = require('./data-interface')

const app = require('./app');
const agent = request.agent(app);

describe('app', () => {
  describe('when authenticated', () => {
    beforeEach(async () => {
      await agent
        .post('/login')
        .send('username=randombrandon&password=randompassword');
    });

    describe('POST /messages', () => {
      describe('with non-empty content', () => {
        describe('with JavaScript code in personalWebsiteURL', () => {
          let response;
          beforeEach(async () => {
            dataInterface.createMessage = jest.fn();
            response = await agent
              .post('/messages')
              .send('content=usertest&personalWebsiteURL=javascript:test');
          });
          it('responds with error', async done => {
            expect(response.statusCode).toBe(400);
            done();
          });
          
          it('does not create a message in the database', async done => {
            expect(dataInterface.createMessage).toHaveBeenCalledTimes(0);
            done();
          })
        });

        describe('with HTTP URL in personalWebsiteURL', () => {
          dataInterface.createMessage = jest.fn();
          let response;
          beforeEach(async () => {
            dataInterface.createMessage = jest.fn();
            response = await agent
              .post('/messages')
              .send('content=usertest&personalWebsiteURL=http://www.google.com');
          });
          it('responds with success', async done => {
          expect(response.statusCode).toBe(201);
          done();
          });
          
          it('does create a message in the database', async done => {
            expect(dataInterface.createMessage).toHaveBeenCalledTimes(1);
            done();
          })
        });
      });
    });
  });
});
