Meteor.methods({
  regenerateToken: function({email, token}) {
    if (!email || !token) {
      throw new Meteor.Error(400, "Email or Token are illegal value!");
    }
    if (this.userId) {
      const userEmail = getUserEmail(this.userId);
      if (userEmail !== email) {
        throw new Meteor.Error(403, `Email ${email} not match!`);
      }
      const student = Students.findOne({email});
      if (!student) {
        throw new Meteor.Error(404, "Your profile not found!");
      }
      const preToken = student.token;
      if (preToken !== token) {
        throw new Meteor.Error(403, "Your token already changed!");
      }
      const newToken = Random.id();
      return Students.update({_id: student._id}, {$set: { token: newToken } });
    } else {
      throw new Meteor.Error(401, "not login!");
    }
  }
})