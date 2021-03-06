import {Meteor} from 'meteor/meteor';
import {Accounts} from 'meteor/accounts-base';
import {Random} from 'meteor/random';
import {Students} from 'lib/collections';

const DEBUG = Boolean(process.env.TEST161_DEBUG || Meteor.settings.TEST161_DEBUG);
const TEST161_AUTH0 = Boolean(process.env.TEST161_AUTH0 || Meteor.settings.TEST161_AUTH0);

Meteor.methods({
  isDebug() {
    return DEBUG && !TEST161_AUTH0;
  }
});

if (DEBUG) {
  // const getTargetStats = (i = 1) => {
  //   return {
  //     target_name: 'asst' + i,
  //     target_version: 1,
  //     target_type: 'asst',
  //     max_score: 50,
  //     total_submissions: 1,
  //     total_complete: 1,
  //     high_score: 50,
  //     low_score: 50,
  //     avg_score: 50,
  //     best_perf: 0,
  //     worst_perf: 0,
  //     avg_perf: 0,
  //     best_submission_id: '96df6ff6-7873-4e57-9794-bd4d8d57b971'
  //   };
  // };
  //
  // const generateMockStudent = function (email) {
  //   const student = Students.findOne({email});
  //   if (!student) {
  //     return;
  //   }
  //   if (!student.target_stats) {
  //     const target_stats = [
  //       getTargetStats(1),
  //       getTargetStats(2),
  //       getTargetStats(3)
  //     ];
  //     const total_submissions = 3;
  //     const debug = true;
  //     Students.update({email}, {$set: {target_stats, total_submissions, debug } });
  //   }
  // }

  Accounts.registerLoginHandler(function (loginRequest) {
    if (!loginRequest.debug) {
      return undefined;
    } else if (loginRequest.password !== 'admin-password') {
      return null;
    }

    let userId = null;
    let user = Meteor.users.findOne({username: 'admin'});
    const email = 'admin@ops-class.org';
    if (!user) {
      const id = Random.id();
      user = {
        username: 'admin',
        createdAt: new Date(),
        services: {
          auth0: {
            email,
            email_verified: true,
            user_id: 'auth0|' + id,
            name: 'admin@ops-class.org',
            nickname: 'admin',
            global_client_id: 'Rf8od4jJNfYw7DGfjPMQLfxXb7MjS3pP',
            user_metadata: { staff: true },
            id: 'auth0|' + id
          },
          resume: { loginTokens: [] }
        }
      };
      userId = Meteor.users.insert(user);
    } else {
      userId = user._id;
    }

    // generateMockStudent(email);
    Students.update({email}, {$set: { debug: true } });
    return {userId};
  });
}
